using BackGroundService.Utils.CaseService;
using BackGroundService.Utils.UserService;
using BackGroundService.Utils.ResponseService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using BackGroundService.Logger;
using BackGroundService.Utils.SenderService;
using Microsoft.Extensions.Configuration;

namespace BackGroundService
{
    internal class Program
    {
        public static async Task Main(string[] args)
        {
            var host = Host.CreateDefaultBuilder(args)
                    .ConfigureAppConfiguration((hostingContext, config) =>
                    {
                        config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
                    })
                .ConfigureServices((context, services) =>
                {
                    var configuration = context.Configuration;
                    services.AddDbContext<ApplicationDBContext>(options =>
                        options.UseNpgsql(configuration["ConnectionStrings:DefaultConnection"]!));

                    services.AddHttpClient<ISenderService, SenderService>(client =>
                    {
                        client.BaseAddress = new Uri(configuration["ApiSettings:SenderUrl"]!);
                    });

                    services.AddSingleton<ILoggerService, LoggerService>();
                    services.AddScoped<ICaseService, CaseService>();
                    services.AddScoped<IUserService, UserService>();
                    services.AddScoped<IResponseService, ResponseService>();

                    services.AddHostedService<DailyWorker>();
                    var senderUrl = configuration["ApiSettings:SenderUrl"];
                    Console.WriteLine($"SenderUrl: '{senderUrl}'");
                    if (string.IsNullOrWhiteSpace(senderUrl))
                    {
                        throw new InvalidOperationException("SenderUrl не задан в конфигурации!");
                    }
                })
                .Build();
            await host.RunAsync();
        }
    }
}