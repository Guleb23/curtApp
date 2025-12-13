using ApiForSud.Services.PdfService;
using ApiForSud.Services.ReportService;
using Org.BouncyCastle.Security;
using Microsoft.AspNetCore.Mvc;
using ApiForSud.DTOs.ForReport;
using Microsoft.AspNetCore.Authorization;

namespace ApiForSud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IPdfService _pdfService;
        private readonly IReportService _reportService;

        public ReportController(IPdfService pdf, IReportService reportService)
        {
            _pdfService = pdf;
            _reportService = reportService;
        }

        [Authorize(Roles = "Director")]
        [HttpPost]
        public async Task<IActionResult> GetPdfReport(InputDateDto dateDto)
        {
            var fromDate = DateTime.SpecifyKind(dateDto.Start, DateTimeKind.Utc);
            var toDate = DateTime.SpecifyKind(dateDto.End, DateTimeKind.Utc);

            var reportData = await _reportService.GenerateDataForReportAsync(fromDate, toDate);
            var pdfBytes = _pdfService.GeneratePdfReport(reportData, fromDate, toDate);

            return File(pdfBytes, "application/pdf", "report.pdf");
        }

    }
}
