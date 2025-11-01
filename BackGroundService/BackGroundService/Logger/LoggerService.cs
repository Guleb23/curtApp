using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackGroundService.Logger
{
    internal class LoggerService : ILoggerService
    {

        private readonly string _basePath;
        private readonly object _lock = new object();

        public LoggerService()
        {
            _basePath = Path.Combine(Environment.CurrentDirectory, "logs");
            Directory.CreateDirectory(_basePath);

            WriteLog("Программа запущена", "INFO");
        }

        public void DbError(string message)
        {
            WriteLog(message, "ERROR");
        }

        public void DbInfo(string message)
        {
            WriteLog(message, "INFO");
        }

        private void WriteLog(string message, string level)
        {
            string logFile = Path.Combine(_basePath, $"{DateTime.Now:yyyy-MM-dd}.txt");
            string logMessage = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] [{level}] {message}{Environment.NewLine}";

            lock (_lock)
            {
                File.AppendAllText(logFile, logMessage, System.Text.Encoding.UTF8);
            }
        }
    }
}
