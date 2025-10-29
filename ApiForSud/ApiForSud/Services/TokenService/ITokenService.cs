using ApiForSud.Models.DatabaseModels;

namespace ApiForSud.Services.TokenService
{
    public interface ITokenService
    {
        string CreateToken(User user);

        string CreateRefreshToken();
    }
}
