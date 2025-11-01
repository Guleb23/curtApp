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

            Console.WriteLine($"Login: {login}");
            Console.WriteLine($"connection: {connection}");
            Console.WriteLine($"psw: {psw}");
            bool allSent = true;

            using var smtpClient = new SmtpClient();
            try
            {
                try
                {
                    await smtpClient.ConnectAsync(connection, 587, MailKit.Security.SecureSocketOptions.StartTls);
                }
                catch (SmtpProtocolException ex)
                {
                    Console.WriteLine("Проблема при подключении к Gmail, попробую ещё раз через 5 секунд...");
                    await Task.Delay(5000);
                    await smtpClient.ConnectAsync(connection, 587, MailKit.Security.SecureSocketOptions.StartTls);
                }

                await smtpClient.AuthenticateAsync(login, psw);

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
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Ошибка отправки email пользователю {data.Email}: {ex.Message}");
                        allSent = false; // фиксируем, что хотя бы одно письмо не отправилось
                    }
                }

                await smtpClient.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка подключения к SMTP: {ex.Message}");
                return false;
            }

            return allSent;
        }
    }
}
