using Microsoft.AspNetCore.Mvc;
using SchoolAdmissionSystem.Application.Extensions;
using SchoolAdmissionSystem.Application.Interfaces;

namespace SchoolAdmissionSystem.Api.Controllers.MyApplicationController
{
    [Route("api/me")]
    [ApiController]
    public class MyApplicationsController : ControllerBase
    {
        private readonly ILogger<MyApplicationsController> _logger;
        private readonly IMyApplicationService _myApplicationService;

        public MyApplicationsController(ILogger<MyApplicationsController> logger, IMyApplicationService myApplicationService)
        {
            _logger = logger;
            _myApplicationService = myApplicationService;
        }

        [HttpGet("holds")]
        public async Task<IActionResult> GetMyApplications([FromHeader(Name = "X-Student-Id")] string studentId)
        {
            if (!studentId.IsValidStudentId())
            {
                return BadRequest("Invalid student ID format. It must be a 17-digit number.");
            }
            _logger.LogInformation("Retrieving my applications for student: {StudentId}", studentId);
            var myApplications = await _myApplicationService.GetMyApplicationsAsync(studentId);

            return Ok(myApplications);
        }
    }
}
