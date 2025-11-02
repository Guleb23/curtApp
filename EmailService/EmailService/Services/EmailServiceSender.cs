using EmailService.ResponseDTO;
using MailKit.Net.Smtp;
using MimeKit;
using System.Net.Sockets;
using System.Net;
using MailKit.Security;

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

            Console.WriteLine($"=== SMTP DEBUG ===");
            Console.WriteLine($"Trying to connect to {connection}...");

            bool allSent = true;

            using var smtpClient = new SmtpClient();

            // Увеличиваем таймаут
            smtpClient.Timeout = 60000; // 60 секунд
            smtpClient.ServerCertificateValidationCallback = (s, c, h, e) => true;

            try
            {
                Console.WriteLine($"Attempt 1: Port 443 with StartTls...");
                await smtpClient.ConnectAsync(connection, 443, MailKit.Security.SecureSocketOptions.StartTls);
            }
            catch (Exception ex1)
            {
                Console.WriteLine($"Port 587 failed: {ex1.Message}");

                try
                {
                    Console.WriteLine($"Attempt 2: Port 465 with SSL...");
                    await smtpClient.ConnectAsync(connection, 465, true);
                }
                catch (Exception ex2)
                {
                    Console.WriteLine($"Port 465 failed: {ex2.Message}");

                    try
                    {
                        Console.WriteLine($"Attempt 3: Port 25 without SSL...");
                        await smtpClient.ConnectAsync(connection, 25, false);
                    }
                    catch (Exception ex3)
                    {
                        Console.WriteLine($"All connection attempts failed:");
                        Console.WriteLine($"- Port 587: {ex1.Message}");
                        Console.WriteLine($"- Port 465: {ex2.Message}");
                        Console.WriteLine($"- Port 25: {ex3.Message}");
                        return false;
                    }
                }
            }

            Console.WriteLine($"Successfully connected to {connection}!");

            try
            {
                Console.WriteLine($"Authenticating as {login}...");
                await smtpClient.AuthenticateAsync(login, psw);
                Console.WriteLine($"Authentication successful!");
            }
            catch (Exception authEx)
            {
                Console.WriteLine($"Authentication failed: {authEx.Message}");
                return false;
            }

            // Отправка emails...
            foreach (var data in usersData)
            {
                if (data?.Email == null || data.OverdueCasesId == null || !data.OverdueCasesId.Any())
                    continue;

                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(login));
                email.To.Add(MailboxAddress.Parse(data.Email));
                email.Subject = "Срочная информация по судебным делам";
                email.Body = new TextPart(MimeKit.Text.TextFormat.Plain)
                {
                    Text = $"По вашим делам №{string.Join(", ", data.OverdueCasesId)} приближается срок 30 дней"
                };

                try
                {
                    await smtpClient.SendAsync(email);
                    Console.WriteLine($"Email sent to {data.Email}");
                }
                catch (Exception sendEx)
                {
                    Console.WriteLine($"Failed to send to {data.Email}: {sendEx.Message}");
                    allSent = false;
                }
            }

            await smtpClient.DisconnectAsync(true);
            return allSent;
        }
    }
}
