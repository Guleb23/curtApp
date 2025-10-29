namespace ApiForSud.Services.PasswordService
{
    public interface IPasswordService
    {
        string HashPassword(string password);
        bool VerifyPassword(string inputPassword, string passwordHash);
    }
}
