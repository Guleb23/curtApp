using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackGroundService.Logger
{
    internal interface ILoggerService
    {
        void DbInfo(string message);

        void DbError(string message);
    }
}
