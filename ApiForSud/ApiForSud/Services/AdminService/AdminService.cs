using ApiForSud.Data;
using ApiForSud.DTOs;
using ApiForSud.Models.DatabaseModels;
using ApiForSud.Services.PasswordService;
using Microsoft.EntityFrameworkCore;

namespace ApiForSud.Services.DirectorService
{
    public class AdminService : IAdminService
    {
        private readonly IPasswordService _passwordService;
        private readonly ApplicationDBContext _dbcontext;

        public AdminService(IPasswordService passwordService, ApplicationDBContext dbContext)
        {
            _passwordService = passwordService;
            _dbcontext = dbContext;
        }


        public async Task<MessageDto> CreateUser(UserDTO userDTO)
        {
            if (userDTO == null)
            {
                return new MessageDto() { Status = false, Message = "UserDto is null", User = null };
            }
            var existingUser = await _dbcontext.Users
            .FirstOrDefaultAsync(u => u.Login == userDTO.Login || u.Email == userDTO.Email);

            if (existingUser != null)
            {
                return new MessageDto()
                {
                    Status = false,
                    Message = "User with this login or email already exists",
                    User = null
                };
            }
            try
            {
                User newUser = new User()
                {
                    Id = Guid.NewGuid(),
                    FIO = userDTO.FIO,
                    Login = userDTO.Login,
                    PasswordHash = _passwordService.HashPassword(userDTO.Password),
                    Email = userDTO.Email,
                    RoleId = userDTO.RoleId
                };
                _dbcontext.Users.Add(newUser);
                await _dbcontext.SaveChangesAsync();
                return new MessageDto() { Status = true, Message = "Success", User = newUser };
            }
            catch (Exception ex) 
            {
                return new MessageDto() { Status = false, Message = ex.Message, User = null };
            }
        }

        public async Task<MessageDto> DeleteUserAsync(Guid guid)
        {
            var currentUser = await _dbcontext.Users.FirstOrDefaultAsync(u => u.Id == guid);

            if (currentUser == null) 
            {
                return new MessageDto() { Status = false, Message = "User not found", User = null };
            }

            try
            {
                _dbcontext.Users.Remove(currentUser);
                await _dbcontext.SaveChangesAsync();
                return new MessageDto() { Status = true, Message = "Success", User = null };
            }
            catch (Exception ex) {
                return new MessageDto() { Status = false, Message = ex.Message, User = null };
            }
        }

        public async Task<List<ReqUserDto>> GetAllUsersAsync()
        {
            return await _dbcontext.Users.Select(u => new ReqUserDto
            {
                 Id = u.Id,
                 RoleId = u.RoleId,
                 FIO = u.FIO,
                 Email = u.Email,
                 Login = u.Login
            }).ToListAsync();
        }
    }
}
