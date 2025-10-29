using ApiForSud.DTOs;
using ApiForSud.Models.DatabaseModels;
using ApiForSud.Services.CaseService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ApiForSud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CaseController : ControllerBase
    {

        private readonly ICaseService _caseService;

        public CaseController(ICaseService caseService)
        {
            _caseService = caseService;
        }


        [Authorize(Roles = "User")]
        [HttpPost("create")]
        public async Task<ActionResult<Case>> CreateCase(CaseDTO caseDTO)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid token");
            }
            else
            {
                var newCase = await _caseService.CreateCase(caseDTO, userId);

                return newCase is null ? BadRequest() : Ok(newCase);
            }


        }

        [Authorize]
        [HttpGet("allcases")]
        public async Task<ActionResult<List<Case>>> GetAllCases()
        {
            return await _caseService.GetAllCases();
        }



        [Authorize]
        [HttpDelete("{caseId}")]
        public async Task<ActionResult<bool>> DeleteCase(Guid caseId)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null || !Guid.TryParse(claim.Value, out var userId))
            {
                return Unauthorized("Invalid token");
            }
            else
            {
                var result = await _caseService.DeleteCase(caseId, userId);
                return result ? Ok(result) : BadRequest("Err");
            }
        }


        [Authorize(Roles = "User")]
        [HttpPut("{caseId}")]
        public async Task<ActionResult<CaseResponseDTO>> UpdateCase(Guid caseId, CaseWithInstancesDTO updateData)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                {
                    return Unauthorized("Invalid token");
                }

                var updatedCase = await _caseService.UpdateCase(
                    updateData.Case, userId, caseId, updateData.Instances);

                return updatedCase is null
                    ? NotFound("Case not found or access denied")
                    : Ok(updatedCase);
            }
            catch (Exception ex)
            {
                // Логируем полную ошибку
                Console.WriteLine($"Error updating case: {ex}");
                Console.WriteLine($"Inner exception: {ex.InnerException}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [Authorize]
        [HttpGet("detailusercases/{caseId}")]
        public async Task<ActionResult<CaseResponseDTO>> GetDetailCasesById(Guid caseId)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null || !Guid.TryParse(claim.Value, out var userId))
            {
                return Unauthorized("Invalid token");
            }
            else
            {
                var result = await _caseService.GetDetailCasesById(userId, caseId);
                return Ok(result);
            }

        }

        [Authorize]
        [HttpGet("usercases")]
        public async Task<ActionResult<Case>> GetCasesById()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null || !Guid.TryParse(claim.Value, out var userId))
            {
                return Unauthorized("Invalid token");
            }
            else
            {
                var result = await _caseService.GetCasesById(userId);
                return Ok(result) ;
            }

        }
    }
}
