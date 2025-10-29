using ApiForSud.DTOs;
using ApiForSud.Models.DatabaseModels;
using ApiForSud.Services.CurtInstanceService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApiForSud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurtInstanceController : ControllerBase
    {
        private readonly ICurtInstanceService _curtInstanceService;

        public CurtInstanceController(ICurtInstanceService curtInstanceService)
        {
            _curtInstanceService = curtInstanceService;
        }



        [Authorize(Roles = "User")]
        [HttpPost("{caseId}")]
        public async Task<ActionResult<CurtInstance>> CreateInstance(Guid caseId, CurtInstaceDTO curtInstaceDTO)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid token");
            }
            else
            {
                var result = await _curtInstanceService.CreateCurtInstance(caseId, curtInstaceDTO, userId);
                return Ok(result);
            }
        }


        [Authorize(Roles = "User")]
        [HttpPut("cases/{caseId}/instances/{instanceId}")]
        public async Task<ActionResult<CurtInstance>> UpdateInstance(Guid caseId,Guid instanceId,CurtInstaceDTO curtInstaceDTO)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid token");
            }

            var updatedInstance = await _curtInstanceService.UpdateCurtInstance(
                caseId, curtInstaceDTO, userId, instanceId);

            return updatedInstance is null
                ? NotFound(new { message = "Заседание не найдено или нет прав для редактирования" })
                : Ok(updatedInstance);
        }

        [Authorize(Roles = "User")]
        [HttpDelete("cases/{caseId}/instances/{instanceId}")]
        public async Task<ActionResult> DeleteInstance(Guid caseId, Guid instanceId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid token");
            }

            var result = await _curtInstanceService.DeleteCurtInstance(caseId, userId, instanceId);

            return result
                ? Ok(new { message = "Заседание успешно удалено" })
                : NotFound(new { message = "Заседание не найдено или нет прав для удаления" });
        }
    }
}
