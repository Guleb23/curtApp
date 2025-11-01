using BackGroundService.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackGroundService.Utils.CaseService
{
    internal interface ICaseService
    {
        Task<List<CaseInfoDTO>> GetOverdueCases();
    }
}
