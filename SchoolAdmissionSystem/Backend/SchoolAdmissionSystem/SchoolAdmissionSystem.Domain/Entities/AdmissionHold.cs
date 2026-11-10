using SchoolAdmissionSystem.Domain.Enums;

namespace SchoolAdmissionSystem.Domain.Entities
{
    public class AdmissionHold
    {
        public Guid Id { get; set; }

        public Guid ClassId { get; set; }

        public string StudentId { get; set; } = string.Empty;

        public AdmissionStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime ExpiresAt { get; set; }

        public DateTime? ConfirmedAt { get; set; }

        public SchoolClass Class { get; set; } = null!;
    }
}
