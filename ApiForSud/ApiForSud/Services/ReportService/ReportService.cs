using ApiForSud.Data;
using ApiForSud.DTOs.ForReport;
using ApiForSud.Migrations;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace ApiForSud.Services.ReportService
{
    public class ReportService : IReportService
    {
        private readonly ApplicationDBContext _dbContext;

        public ReportService(ApplicationDBContext dBContext)
        {
            _dbContext = dBContext;
        }

        public async Task<List<ReportDto>> GenerateDataForReportAsync(DateTime startDate, DateTime endDate)
        {
            var casesInPeriod = await _dbContext.Cases.Include(c => c.User).Include(c => c.CurtInstances).Where(c => c.CreatedDate >= startDate && c.CreatedDate <= endDate).AsNoTracking().ToListAsync();

            var report = casesInPeriod.GroupBy(c => c.User).Select(c => new ReportDto
            {
                FIO = c.Key.FIO,
                CountCases = c.Count(),
                Cases = c.Select(k => new ShortCaseDto()
                {
                    Id = k.Id,
                    NomerOfCase = k.NomerOfCase,
                    NameOfCurt = k.NameOfCurt,
                    Applicant = k.Applicant,
                    Defendant = k.Defendant,
                    Reason = k.Reason,
                    DateOfCurt = k.DateOfCurt,
                    CreatedDate = k.CreatedDate,
                    ResultOfCurt = k.ResultOfCurt,
                    DateOfResult = k.DateOfResult,
                    CurtInstances = k.CurtInstances.Select(i => new ShortInstanceDto()
                    {
                        Id = i.Id,
                        Name = i.Name,
                        NameOfCurt = i.NameOfCurt,
                        DateOfSession = i.DateOfSession,
                        Link = i.Link,
                        Employee = i.Employee,
                        ResultOfIstance = i.ResultOfIstance,
                        DateOfResult = i.DateOfResult,
                    }).ToList()

                }).ToList()
            }).ToList();

            return report;
        }
    }
}
