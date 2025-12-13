using ApiForSud.DTOs.ForReport;
using iText.IO.Font;
using iText.Kernel.Font;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using static iText.Kernel.Font.PdfFontFactory;

namespace ApiForSud.Services.PdfService
{
    public class PdfService : IPdfService
    {
        public byte[] GeneratePdfReport(List<ReportDto> report, DateTime startDate, DateTime endDate)
        {
            using var ms = new MemoryStream();

            PdfWriter writer = new PdfWriter(ms);
            PdfDocument pdf = new PdfDocument(writer);
            Document doc = new Document(pdf);

            var fontPath = Path.Combine(AppContext.BaseDirectory, "wwwroot/fonts/Arial.ttf"); 
            PdfFont regularFont = PdfFontFactory.CreateFont(fontPath, PdfEncodings.IDENTITY_H, EmbeddingStrategy.PREFER_EMBEDDED);
            PdfFont boldFont = PdfFontFactory.CreateFont(fontPath, PdfEncodings.IDENTITY_H, EmbeddingStrategy.PREFER_EMBEDDED);


            // Заголовок
            doc.Add(new Paragraph("Отчёт по созданным делам")
                .SetFont(boldFont)
                .SetFontSize(18)
                .SetTextAlignment(TextAlignment.CENTER));

            doc.Add(new Paragraph($"Период: {startDate:dd.MM.yyyy} — {endDate:dd.MM.yyyy}")
                .SetFont(regularFont)
                .SetFontSize(12)
                .SetTextAlignment(TextAlignment.CENTER)
                .SetMarginBottom(20));

            // --- Общая статистика ---
            doc.Add(new Paragraph("Общая статистика по пользователям")
                .SetFont(boldFont)
                .SetFontSize(14)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetMarginBottom(5));

            var summaryTable = new Table(UnitValue.CreatePercentArray(2)).UseAllAvailableWidth();
            summaryTable.AddHeaderCell(new Cell().Add(new Paragraph("Пользователь").SetFont(boldFont)));
            summaryTable.AddHeaderCell(new Cell().Add(new Paragraph("Количество дел").SetFont(boldFont)));

            foreach (var userReport in report)
            {
                summaryTable.AddCell(new Paragraph(userReport.FIO ?? "-").SetFont(regularFont));
                summaryTable.AddCell(new Paragraph(userReport.CountCases.ToString()).SetFont(regularFont));
            }

            doc.Add(summaryTable);

            doc.Add(new Paragraph("\n")); // небольшой отступ после общей статистики

            // --- Подробный отчёт по каждому пользователю ---
            foreach (var userReport in report)
            {
                doc.Add(new Paragraph($"{userReport.FIO} — всего дел: {userReport.CountCases}")
                    .SetFont(boldFont)
                    .SetFontSize(14)
                    .SetMarginTop(10));

                foreach (var c in userReport.Cases)
                {
                    doc.Add(new Paragraph($"Дело № {c.Id}")
                        .SetFont(boldFont)
                        .SetFontSize(14)
                        .SetTextAlignment(TextAlignment.CENTER));

                    // Таблица дела
                    var caseTable = new Table(UnitValue.CreatePercentArray(5)).UseAllAvailableWidth();
                    caseTable.AddHeaderCell(new Cell().Add(new Paragraph("Номер дела").SetFont(boldFont)));
                    caseTable.AddHeaderCell(new Cell().Add(new Paragraph("Истец").SetFont(boldFont)));
                    caseTable.AddHeaderCell(new Cell().Add(new Paragraph("Ответчик").SetFont(boldFont)));
                    caseTable.AddHeaderCell(new Cell().Add(new Paragraph("Причина").SetFont(boldFont)));
                    caseTable.AddHeaderCell(new Cell().Add(new Paragraph("Дата суда").SetFont(boldFont)));

                    caseTable.AddCell(new Paragraph(c.NomerOfCase ?? "-").SetFont(regularFont));
                    caseTable.AddCell(new Paragraph(c.Applicant ?? "-").SetFont(regularFont));
                    caseTable.AddCell(new Paragraph(c.Defendant ?? "-").SetFont(regularFont));
                    caseTable.AddCell(new Paragraph(c.Reason ?? "-").SetFont(regularFont));
                    caseTable.AddCell(new Paragraph(c.DateOfCurt?.ToString("dd.MM.yyyy") ?? "-").SetFont(regularFont));

                    doc.Add(caseTable);

                    doc.Add(new Paragraph("\n"));

                    // Таблица инстанций
                    if (c.CurtInstances != null && c.CurtInstances.Count > 0)
                    {
                        doc.Add(new Paragraph("Инстанции")
                            .SetFont(boldFont)
                            .SetFontSize(14)
                            .SetTextAlignment(TextAlignment.CENTER)
                            .SetMarginBottom(5));

                        var instTable = new Table(UnitValue.CreatePercentArray(5)).UseAllAvailableWidth();
                        instTable.AddHeaderCell(new Cell().Add(new Paragraph("Инстанция").SetFont(boldFont)));
                        instTable.AddHeaderCell(new Cell().Add(new Paragraph("Суд").SetFont(boldFont)));
                        instTable.AddHeaderCell(new Cell().Add(new Paragraph("Дата сессии").SetFont(boldFont)));
                        instTable.AddHeaderCell(new Cell().Add(new Paragraph("Сотрудник").SetFont(boldFont)));
                        instTable.AddHeaderCell(new Cell().Add(new Paragraph("Результат").SetFont(boldFont)));

                        foreach (var i in c.CurtInstances)
                        {
                            instTable.AddCell(new Paragraph(i.Name ?? "-").SetFont(regularFont));
                            instTable.AddCell(new Paragraph(i.NameOfCurt ?? "-").SetFont(regularFont));
                            instTable.AddCell(new Paragraph(i.DateOfSession?.ToString("dd.MM.yyyy") ?? "-").SetFont(regularFont));
                            instTable.AddCell(new Paragraph(i.Employee ?? "-").SetFont(regularFont));
                            instTable.AddCell(new Paragraph(i.ResultOfIstance ?? "-").SetFont(regularFont));
                        }

                        // Разграничительная линия перед таблицей инстанций
                        doc.Add(new LineSeparator(new SolidLine(1f)).SetMarginTop(5).SetMarginBottom(5));
                        doc.Add(instTable);
                    }

                    // Разграничительная линия между делами
                    doc.Add(new LineSeparator(new SolidLine(1.5f)).SetMarginTop(10).SetMarginBottom(10));
                }
            }

            doc.Close();
            return ms.ToArray();
        }
    }
}
