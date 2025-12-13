using ApiForSud.DTOs;
using ApiForSud.Models.DatabaseModels;

namespace ApiForSud.Services.DirectorService
{
    public interface IAdminService
    {
        Task<MessageDto> CreateUser(UserDTO userDTO);

        Task<List<ReqUserDto>> GetAllUsersAsync();

        Task<MessageDto> DeleteUserAsync(Guid guid);
    }
}
