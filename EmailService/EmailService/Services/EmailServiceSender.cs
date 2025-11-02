using EmailService.ResponseDTO;
using MailKit.Net.Smtp;
using MimeKit;

namespace EmailService.Services
{
    public class EmailServiceSender : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailServiceSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendEmailAsync(List<UserDataForEmailDTO> usersData)
        {
            if (usersData == null || !usersData.Any())
                return false;

            string psw = _configuration["smtpConfig:psw"]!;
            string login = _configuration["smtpConfig:login"]!;
            string connection = _configuration["smtpConfig:smtpConnection"]!;

            bool allSent = true;

            using var smtpClient = new SmtpClient();

            try
            {
                // Подключение к SMTP-серверу
                await smtpClient.ConnectAsync(connection, 465, MailKit.Security.SecureSocketOptions.SslOnConnect);

                if (!smtpClient.IsConnected)
                {
                    Console.WriteLine("Не удалось подключиться к SMTP-серверу");
                    return false;
                }

                // Аутентификация - используем данные из конфигурации
                await smtpClient.AuthenticateAsync(login, psw);

                if (!smtpClient.IsAuthenticated)
                {
                    Console.WriteLine("Не удалось пройти аутентификацию на SMTP-сервере");
                    await smtpClient.DisconnectAsync(true);
                    return false;
                }

                foreach (var data in usersData)
                {
                    if (data?.Email == null || data.OverdueCasesId == null || !data.OverdueCasesId.Any())
                        continue;

                    string message = $"По вашим делам №{string.Join(", ", data.OverdueCasesId)} приближается срок 30 дней";
                    var email = new MimeMessage();
                    email.From.Add(MailboxAddress.Parse(login));
                    email.To.Add(MailboxAddress.Parse(data.Email));
                    email.Subject = "Срочная информация по судебным делам";
                    email.Body = new TextPart(MimeKit.Text.TextFormat.Text)
                    {
                        Text = message
                    };

                    try
                    {
                        await smtpClient.SendAsync(email);
                        Console.WriteLine($"Email успешно отправлен пользователю {data.Email}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Ошибка отправки email пользователю {data.Email}: {ex.Message}");
                        allSent = false;
                    }
                }

                await smtpClient.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Общая ошибка при работе с SMTP: {ex.Message}");
                return false;
            }

            return allSent;
        }
    }
}