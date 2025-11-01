using BackGroundService.DTO;
using BackGroundService.Utils.CaseService;
using BackGroundService.Utils.UserService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackGroundService.Utils.ResponseService
{
    internal class ResponseService : IResponseService
    {
        private readonly ICaseService _caseService;
        private readonly IUserService _userService;

        public ResponseService(ICaseService caseService, IUserService userService)
        {
            _caseService = caseService;
            _userService = userService;
        }

        public async Task<List<ResponseDTO>> GetResponse()
        {
            var casesInfo = await _caseService.GetOverdueCases();
            var result = new List<ResponseDTO>();
            foreach (var cases in casesInfo)
            {
                var responseDTO = new ResponseDTO();
                string email = await _userService.GetEmailUserById(cases.UserId);
                responseDTO.Email = email;
                responseDTO.OverdueCasesId = cases.OverdueCasesId;
                result.Add(responseDTO);
            }

            return result;
        }
    }
}


