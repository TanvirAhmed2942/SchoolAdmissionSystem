using SchoolAdmissionSystem.Domain.Enums;

namespace SchoolAdmissionSystem.Application.Dto
{
    public class MyApplicationDto
    {
        public Guid Id { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public string StudentId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public DateTime? ConfirmedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }

        public AdmissionStatus Status { get; set; }
    }
}
