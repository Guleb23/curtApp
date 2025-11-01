using BackGroundService.DTO;
using BackGroundService.Logger;
using BackGroundService.Models;
using Microsoft.EntityFrameworkCore;

namespace BackGroundService.Utils.CaseService
{
    internal class CaseService : ICaseService
    {

        private readonly ApplicationDBContext _dbContext;
        private readonly ILoggerService _logger;

        public CaseService(ApplicationDBContext applicationDBContext, ILoggerService logger)
        {
            _logger = logger;
            _dbContext = applicationDBContext;
        }

        public async Task<List<CaseInfoDTO>> GetOverdueCases()
        {
            try
            {
                var cases = await _dbContext.Cases
                    .AsNoTracking()
                    .ToListAsync();

                if (cases == null || cases.Count == 0)
                {
                    _logger.DbInfo("В базе данных нет дел для обработки.");
                    return new List<CaseInfoDTO>();
                }

                _logger.DbInfo($"Успешно получен список дел. Всего записей: {cases.Count}");

                var overdueCases = GetCases(cases);
                var result = new List<CaseInfoDTO>();

                foreach (var res in overdueCases)
                {
                    result.Add(new CaseInfoDTO
                    {
                        UserId = res.Key,
                        OverdueCasesId = res.Value
                    });
                }

                _logger.DbInfo($"Найдено просроченных дел: {result.Sum(x => x.OverdueCasesId.Count)} для {result.Count} пользователей.");

                return result;
            }
            catch (Exception ex)
            {
                _logger.DbError($"Ошибка при получении дел: {ex.Message}");
                return new List<CaseInfoDTO>();
            }
        }


        private Dictionary<Guid, List<string>> GetCases(List<CaseModel> cases)
        {
            var result = new Dictionary<Guid, List<string>>();
            DateTime now = DateTime.Now;
            foreach (var c in cases)
            {

                var t = now - c.DateOfResult;
                int daysPassed = t?.Days ?? 0;
                if (daysPassed > 20 && c.IsNotificated == false)
                {
                    AddInfoInDict(c.UserId, c.NomerOfCase, result);
                }

            }

            return result;
        }

        private void AddInfoInDict(Guid userId, string caseId, Dictionary<Guid, List<string>> result)
        {
            if (!result.ContainsKey(userId))
            {
                result[userId] = new List<string>();
            }
            result[userId].Add(caseId);
        }
    }
}
