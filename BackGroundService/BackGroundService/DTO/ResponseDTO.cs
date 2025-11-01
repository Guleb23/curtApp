using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackGroundService.DTO
{
    internal class ResponseDTO
    {
        public string Email { get; set; }

        public List<string> OverdueCasesId { get; set; }
    }
}
