using BackGroundService.Logger;
using BackGroundService.Utils.CaseService;
using BackGroundService.Utils.ResponseService;
using BackGroundService.Utils.SenderService;
using BackGroundService.Utils.UserService;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackGroundService
{
    internal class DailyWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeZoneInfo _moscowZone;
        private readonly ILoggerService _loggerService;
        private readonly ISenderService _sender;


        public DailyWorker(IServiceProvider serviceProvider, ILoggerService loggerService, ISenderService sender)
        {
            _sender = sender;
            _loggerService = loggerService;
            _serviceProvider = serviceProvider;
            _moscowZone = TimeZoneInfo.FindSystemTimeZoneById(
                OperatingSystem.IsWindows() ? "Russian Standard Time" : "Europe/Moscow"
            );
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            Console.WriteLine("Фоновый сервис запущен. Ожидание времени 6:00 по Москве...");


            bool testEmailService = false;
            for (int i = 0; i < 5; i++)
            {
                testEmailService = await _sender.TestMessage();
                if (testEmailService) break;
                await Task.Delay(2000);
            }

            if (testEmailService)
                _loggerService.DbInfo("Тестовое сообщение отправлено успешно");
            else
                _loggerService.DbError("Не удалось отправить тестовое сообщение после 5 попыток");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var nowUtc = DateTime.UtcNow;
                    var nowMoscow = TimeZoneInfo.ConvertTimeFromUtc(nowUtc, _moscowZone);

                    var nextRunMoscow = nowMoscow.Date.AddHours(15);
                    if (nowMoscow >= nextRunMoscow)
                        nextRunMoscow = nextRunMoscow.AddDays(1);

                    var nextRunUtc = TimeZoneInfo.ConvertTimeToUtc(nextRunMoscow, _moscowZone);
                    var delay = nextRunUtc - nowUtc;

                    Console.WriteLine($"Следующий запуск в {nextRunMoscow:yyyy-MM-dd HH:mm:ss} (МСК)");
                    await Task.Delay(delay, stoppingToken);
                    await DoWork(stoppingToken);
                }
                catch (TaskCanceledException)
                {

                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Ошибка в фоновом сервисе: {ex.Message}");
                    await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
                }
            }
        }

        private async Task DoWork(CancellationToken stoppingToken)
        {
            _loggerService.DbInfo("Запущен процесс");
            using (var scope = _serviceProvider.CreateScope())
            {
                var caseService = scope.ServiceProvider.GetRequiredService<ICaseService>();
                var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
                var responseService = scope.ServiceProvider.GetRequiredService<IResponseService>();

                Console.WriteLine($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] Начинаю выполнение задачи...");

                var overdueCases = await caseService.GetOverdueCases();
                var responses = await responseService.GetResponse();
                if (responses.Count > 0)
                {
                    bool result = await _sender.SendMessage(responses, stoppingToken);
                    if (result)
                    {
                        _loggerService.DbInfo("Данные успешно отправлены");
                    }
                    else
                    {
                        _loggerService.DbError("Произошла ошибка отправки");
                    }
                }
                else
                {
                    _loggerService.DbInfo("Нету данных для отправки");
                }



                foreach (var response in responses)
                {
                    Console.WriteLine($"Email: {response.Email}");
                    Console.WriteLine($"Overdue Cases: {string.Join(", ", response.OverdueCasesId)}");
                    Console.WriteLine("---");
                }

                Console.WriteLine($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] Задача завершена.");
            }
        }
    }
}
