using ApiForSud.DTOs;
using ApiForSud.Models;
using ApiForSud.Models.DatabaseModels;

namespace ApiForSud.Services.AuthService
{
    public interface IAuthService
    {
        Task<User?> CreateUser(UserDTO userDTO);

        Task<TokenResponse> Login(UserDTO userDTO);

        Task<TokenResponse> RefreshToken(RefreshTokenRequestDTO tokenDTO);

        Task<bool> Logout(Guid userId);
    }
}


