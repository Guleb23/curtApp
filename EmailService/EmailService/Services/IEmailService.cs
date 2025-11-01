using EmailService.ResponseDTO;

namespace EmailService.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(List<UserDataForEmailDTO> data);
    }
}
