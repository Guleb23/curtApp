using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackGroundService.DTO
{
    internal class CaseInfoDTO
    {
        public Guid UserId { get; set; }

        public List<string> OverdueCasesId { get; set; }
    }
}
