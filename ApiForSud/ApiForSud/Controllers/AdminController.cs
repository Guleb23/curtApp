using ApiForSud.DTOs;
using ApiForSud.Models.DatabaseModels;
using ApiForSud.Services.DirectorService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApiForSud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _directorService;

        public AdminController(IAdminService directorService)
        {
            _directorService = directorService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("user")]
        public async Task<ActionResult<MessageDto>> CreateUser(UserDTO userDTO)
        {
            var isCreated = await _directorService.CreateUser(userDTO);

            if (isCreated.Status == true) 
            {
                return Ok(isCreated);
            }

            return BadRequest(isCreated);
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        public async Task<ActionResult<List<ReqUserDto>>> GetUsers()
        {
            var users = await _directorService.GetAllUsersAsync();
            return Ok(users);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("user/{id}")]
        public async Task<ActionResult<MessageDto>> DeleteUser(Guid id)
        {
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (currentUserIdClaim == null)
                return Unauthorized("Не удалось определить текущего пользователя.");

            var currentUserId = Guid.Parse(currentUserIdClaim.Value);

            if (currentUserId == id)
                return BadRequest("Нельзя удалить самого себя.");

            var res = await _directorService.DeleteUserAsync(id);

            if (res.Status)
                return Ok(res.Message);

            return BadRequest(res.Message);
        }
    }
}
