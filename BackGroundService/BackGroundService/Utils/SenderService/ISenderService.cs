using BackGroundService.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackGroundService.Utils.SenderService
{
    internal interface ISenderService
    {
        Task<bool> SendMessage(List<ResponseDTO> responses, CancellationToken cancellationToken = default);

        Task<bool> TestMessage();


    }
}
