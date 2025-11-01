using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackGroundService.Utils.UserService
{
    internal interface IUserService
    {
        Task<string> GetEmailUserById(Guid id);
    }
}
