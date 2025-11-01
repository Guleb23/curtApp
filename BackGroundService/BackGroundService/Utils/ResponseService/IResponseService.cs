using BackGroundService.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackGroundService.Utils.ResponseService
{
    internal interface IResponseService
    {
        Task<List<ResponseDTO>> GetResponse();
    }
}
