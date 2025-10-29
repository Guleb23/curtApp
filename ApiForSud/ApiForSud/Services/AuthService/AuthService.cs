using ApiForSud.Data;
using ApiForSud.DTOs;
using ApiForSud.Models;
using ApiForSud.Models.DatabaseModels;
using ApiForSud.Services.PasswordService;
using ApiForSud.Services.TokenService;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace ApiForSud.Services.AuthService
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDBContext _context;
        private readonly IPasswordService _passwordService;
        private readonly ITokenService _tokenService;
        public AuthService(ApplicationDBContext context, IPasswordService passwordService, ITokenService tokenService)
        {
            _context = context;
            _passwordService = passwordService;
            _tokenService = tokenService;
        }

        public async Task<User?> CreateUser(UserDTO userDTO)
        {
            bool userExists = await _context.Users
                .AnyAsync(u => u.Login == userDTO.Login);

            if (userExists)
            {
                return null;
            }
            else
            {
                User user = new User()
                {
                    Id = Guid.NewGuid(),
                    Login = userDTO.Login,
                    PasswordHash = _passwordService.HashPassword(userDTO.Password),
                    RoleId = 1
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return user;

            }
        }

        public async Task<TokenResponse> Login(UserDTO userDTO)
        {
            if (string.IsNullOrWhiteSpace(userDTO.Login) ||
                string.IsNullOrWhiteSpace(userDTO.Password))
            {
                return null;
            }

            var currentUser = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Login == userDTO.Login);

            if (currentUser == null)
            {
                return null;
            }

            bool isPasswordCorrect = _passwordService.VerifyPassword(
                userDTO.Password,
                currentUser.PasswordHash
            );

            if (!isPasswordCorrect)
            {
                return null;
            }

            return await CreateTokenResponse(currentUser);
        }

        public async Task<bool> Logout(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null) 
            {
                return false;
            }
            else
            {
                user.RefreshToken = null;
                user.RefreshTokenExpiryTime = null;
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<TokenResponse> RefreshToken(RefreshTokenRequestDTO tokenDTO)
        {
            var user = await ValidateRefreshTokenAsync(tokenDTO.UserId, tokenDTO.RefreshToken);
            if (user == null)
            {

                return null;
            }
            else
            {
                return await CreateTokenResponse(user);
            };
        }

        private async Task<TokenResponse> CreateTokenResponse(User? currentUser)
        {
            string refresh = await GenerateAndSaveRefreshTokenAsync(currentUser);
            string access = _tokenService.CreateToken(currentUser);

            return new TokenResponse()
            {
                AccessToken = access,
                RefreshToken = refresh,
            };
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            var refreshToken = _tokenService.CreateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(10);
            await _context.SaveChangesAsync();
            return refreshToken;
        }

        private async Task<User> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.RefreshToken != refreshToken
                || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return null;
            }
            else
            {
                return user;
            }

        }
    }
}
