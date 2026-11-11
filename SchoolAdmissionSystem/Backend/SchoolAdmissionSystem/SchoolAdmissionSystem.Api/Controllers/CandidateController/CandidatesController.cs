
using Microsoft.AspNetCore.Mvc;
using SchoolAdmissionSystem.Application.Extensions;
using SchoolAdmissionSystem.Application.Interfaces;
using SchoolAdmissionSystem.Domain.Enums;

namespace SchoolAdmissionSystem.Api.Controllers.CandidateController
{
    [ApiController]
    [Route("api/candidate")]
    public class CandidatesController : ControllerBase
    {
        private readonly ICandidateService _candidateService;

        public CandidatesController(ICandidateService candidateService)
        {
            _candidateService = candidateService;
        }

        // GET: api/candidate/classes
        [HttpGet("classes")]
        public IActionResult GetCandidateClasses()
        {
            return Ok();
        }

        // POST: api/candidate/classes/{classId}/holds
        [HttpPost("classes/{classId:guid}/holds")]
        public async Task<IActionResult> CreateAdmissionHold(
            [FromRoute] Guid classId,
            [FromHeader(Name = "X-Student-Id")] string studentId)
        {
            if (!studentId.IsValidStudentId())
            {
                return BadRequest("Invalid student ID format. It must be a 17-digit number.");
            }
            var result = await _candidateService.CreateHoldAsync(classId, studentId);

            if (result == null)
                return BadRequest("Failed to create admission hold.");

            return Ok(result);
        }

        // GET: api/candidate/classes/holds/{holdId}
        [HttpGet("classes/holds/{holdId:guid}")]
        public async Task<IActionResult> GetHoldById(
            [FromRoute] Guid holdId,
            [FromHeader(Name = "X-Student-Id")] string studentId)
        {
            if (!studentId.IsValidStudentId())
            {
                return BadRequest("Invalid student ID format. It must be a 17-digit number.");
            }
            var result = await _candidateService.GetHoldByIdAsync(holdId, studentId);

            if (result == null)
                return NotFound("Admission hold not found.");

            return Ok(result);
        }

        // POST: api/candidate/classes/holds/{holdId}?status=Cancelled
        [HttpPost("classes/holds/{holdId:guid}")]
        public async Task<IActionResult> UpdateHoldStatus(
            [FromRoute] Guid holdId,
            [FromQuery] AdmissionStatus status,
            [FromHeader(Name = "X-Student-Id")] string studentId)
        {
            if (!studentId.IsValidStudentId())
            {
                return BadRequest("Invalid student ID format. It must be a 17-digit number.");
            }
            var result = await _candidateService.CancelHoldAsync(
                holdId,
                studentId,
                status
            );

            if (result == null)
            {
                return BadRequest("Failed to update admission hold.");
            }

            return Ok(result);
        }
    }
}
