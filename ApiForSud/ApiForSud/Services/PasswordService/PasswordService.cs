using ApiForSud.Models.DatabaseModels;
using Microsoft.AspNetCore.Identity;

namespace ApiForSud.Services.PasswordService
{
    public class PasswordService : IPasswordService
    {
        private readonly PasswordHasher<User> psHasher = new();

        public string HashPassword(string password)
        {
            return psHasher.HashPassword(null, password);
        }

        public bool VerifyPassword(string inputPassword, string passwordHash)
        {
            return psHasher.VerifyHashedPassword(null, passwordHash, inputPassword) == PasswordVerificationResult.Success;
        }
    }
}
