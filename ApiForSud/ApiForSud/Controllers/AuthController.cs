using ApiForSud.DTOs;
using ApiForSud.Models;
using ApiForSud.Models.DatabaseModels;
using ApiForSud.Services.AuthService;
using ApiForSud.Services.PasswordService;
using ApiForSud.Services.TokenService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
namespace ApiForSud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }


        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDTO inputUser)
        {
            if (inputUser == null)
            {
                return BadRequest("Null input data");
            }

            var user = await _authService.CreateUser(inputUser);

            if (user == null)
            {
                return Conflict("User already exists");
            }

            return Ok(user);
        }


        [HttpPost("login")]
        public async Task<ActionResult<TokenResponse>> Login(UserDTO inputUser)
        {
            if (inputUser == null)
            {
                return BadRequest("Invalid user data");
            }

            var result = await _authService.Login(inputUser);

            if (result is null)
            {
                return Unauthorized("Invalid login or password");
            }

            return Ok(result);
        }


        [HttpPost("refresh")]
        public async Task<ActionResult<TokenResponse>> Refresh(RefreshTokenRequestDTO request)
        {
            var tokens = await _authService.RefreshToken(request);

            if(tokens is null)
            {
                return Unauthorized("");
            }
            else
            {
                return Ok(tokens);
            }
        }


        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid token");
            }
            var result = await _authService.Logout(userId);

            if (!result) 
            {
                return BadRequest("Logout failed");
            }
            else
            {
                return Ok("Logged out successfully");
            }
        }

        [Authorize(Roles = "User")]
        [HttpGet("common-area")]
        public IActionResult CommonArea()
        {
            return Ok("Эта зона для пользователей");
        }
    }
}
