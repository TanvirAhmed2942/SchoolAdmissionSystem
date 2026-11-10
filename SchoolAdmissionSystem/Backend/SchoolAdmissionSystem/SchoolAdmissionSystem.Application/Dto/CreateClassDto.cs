using System.ComponentModel.DataAnnotations;

namespace SchoolAdmissionSystem.Application.Dto
{
    public class CreateClassDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]

        public int TotalSeats { get; set; }
    }
}
