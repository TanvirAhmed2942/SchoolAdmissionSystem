
using Microsoft.AspNetCore.Mvc;
using SchoolAdmissionSystem.Application.Dto;
using SchoolAdmissionSystem.Application.Interfaces;

namespace SchoolAdmissionSystem.Api.Controllers.AdminController
{
    [Route("api/admin")]
    [ApiController]
    public class AdminsController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminsController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("classes")]
        public async Task<IActionResult> GetClasses()
        {
            var classes = await _adminService.GetAllClassesAsync();

            return Ok(classes);
        }

        [HttpPost("classes")]
        public async Task<IActionResult> CreateClass(
            [FromBody] AdminDto createClassDto)
        {
            var createdClass = await _adminService.CreateClassAsync(createClassDto);

            return CreatedAtAction(
                nameof(GetClassById),
                new { id = createdClass.Id },
                createdClass
            );
        }

        [HttpGet("classes/{id:guid}")]
        public async Task<IActionResult> GetClassById([FromRoute] Guid id)
        {
            var schoolClass = await _adminService.GetClassByIdAsync(id);

            if (schoolClass == null)
                return NotFound();

            return Ok(schoolClass);
        }

        [HttpDelete("classes/{id:guid}")]
        public async Task<IActionResult> DeleteClass([FromRoute] Guid id)
        {
            var deleteResult = await _adminService.DeleteClassAsync(id);

            if (!deleteResult)
                return NotFound();

            return NoContent();
        }
    }
}
