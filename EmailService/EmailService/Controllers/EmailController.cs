using EmailService.ResponseDTO;
using EmailService.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmailService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService email)
        {
            _emailService = email;
        }


        [HttpPost("/send")]
        public async Task<ActionResult> SendEmail(List<UserDataForEmailDTO> data)
        {
            if (data == null)
            {
                return BadRequest("Request data is required");
            }

            var result = await _emailService.SendEmailAsync(data);

            return result ?
                Ok(new { message = "Email sent successfully" }) :
                StatusCode(500, new { error = "Failed to send email" });
        }

        [HttpGet("/test/{message?}")]
        public IActionResult Test(string? message)
        {
            return Ok(new { status = "ok", receivedMessage = message ?? "" });
        }
    }
}
