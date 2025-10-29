using ApiForSud.Data;
using ApiForSud.Models.DatabaseModels;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ApiForSud.Services.TokenService
{
    public class TokenService : ITokenService
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration, ApplicationDBContext applicationDBContext)
        {
            _configuration = configuration;
            _dbContext = applicationDBContext;
        }

        public string CreateRefreshToken()
        {
            var randomNumber = new byte[32];

            using var rng = RandomNumberGenerator.Create();

            rng.GetBytes(randomNumber);

            return Convert.ToBase64String(randomNumber);
        }

        public string CreateToken(User user)
        {
            string token = string.Empty;
            var roleName = GetRoleName(user.RoleId); 

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Login),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, roleName)
            };


            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration.GetValue<string>("AppSettings:Token")!)
                );

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescr = new JwtSecurityToken(
                issuer: _configuration.GetValue<string>("AppSettings:Issuer"),
                 audience: _configuration.GetValue<string>("AppSettings:Audience"),
                 claims: claims,
                 expires: DateTime.Now.AddDays(1),
                 signingCredentials: cred
                );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescr);
        }

        private string GetRoleName(int userRoleId)
        {
            var role = _dbContext.Roles.Where(r => r.Id == userRoleId).FirstOrDefault();
            return role.Name is null ? "Пользователь" :  role.Name;
        }
    }
}
