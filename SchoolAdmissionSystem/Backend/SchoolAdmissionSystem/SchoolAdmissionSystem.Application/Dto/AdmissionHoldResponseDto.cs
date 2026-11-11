using SchoolAdmissionSystem.Domain.Enums;

namespace SchoolAdmissionSystem.Application.Dto
{
    public class AdmissionHoldResponseDto
    {
        public Guid Id { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public AdmissionStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime? ConfirmedAt { get; set; }
        public string StudentId { get; set; }
    }
}
