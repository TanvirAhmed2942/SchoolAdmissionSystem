using System.ComponentModel.DataAnnotations;

namespace SchoolAdmissionSystem.Application.Dto
{
    public class ClassOverviewDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int TotalSeats { get; set; }
        public int HeldSeats { get; set; }
        public int ConfirmedSeats { get; set; }
        public int AvailableSeats => Math.Max(0, TotalSeats - HeldSeats - ConfirmedSeats);
    }
    public class AdminDto
    {
        [Required, StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Range(1, 500)]
        public int TotalSeats { get; set; }
    }
}
