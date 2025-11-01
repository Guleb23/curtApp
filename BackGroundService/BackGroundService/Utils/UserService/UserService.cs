using BackGroundService.Logger;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackGroundService.Utils.UserService
{
    internal class UserService : IUserService
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly ILoggerService _logger;

        public UserService(ApplicationDBContext dBContext, ILoggerService logger)
        {
            _logger = logger;
            _dbContext = dBContext;
        }

        public async Task<string?> GetEmailUserById(Guid id)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);

                if (user == null)
                {
                    _logger.DbInfo($"Пользователь с ID {id} не найден в базе данных.");
                    return null;
                }

                _logger.DbInfo($"Получение почты пользователя {id} прошло успешно: {user.Email}");
                return user.Email;
            }
            catch (Exception ex)
            {
                _logger.DbError($"Ошибка при получении почты пользователя {id}: {ex.Message}");
                return null;
            }
        }
    }
}
