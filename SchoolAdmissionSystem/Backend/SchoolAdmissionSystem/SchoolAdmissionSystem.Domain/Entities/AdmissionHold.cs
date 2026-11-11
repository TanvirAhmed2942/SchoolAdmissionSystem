using SchoolAdmissionSystem.Domain.Enums;
using SchoolAdmissionSystem.Domain.Exceptions;

namespace SchoolAdmissionSystem.Domain.Entities
{
    public class AdmissionHold
    {
        public Guid Id { get; set; }
        public Guid ClassId { get; set; }
        public string StudentId { get; set; } = string.Empty;
        public AdmissionStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime? ConfirmedAt { get; set; }

        public uint Version { get; set; } // xmin concurrency token

        public SchoolClass Class { get; set; } = null!;

        public static AdmissionHold Create(Guid classId, string studentId, DateTime now, TimeSpan duration)
            => new()
            {
                Id = Guid.NewGuid(),
                ClassId = classId,
                StudentId = studentId,
                Status = AdmissionStatus.HELD,
                CreatedAt = now,
                ModifiedAt = now,
                ExpiresAt = now.Add(duration)
            };

        public void Confirm(DateTime now)
        {
            EnsureActionable(now);
            Status = AdmissionStatus.CONFIRMED;
            ModifiedAt = now;
            ConfirmedAt = now;
        }

        public void Cancel(DateTime now)
        {
            EnsureActionable(now);
            Status = AdmissionStatus.CANCELLED;
            ModifiedAt = now;
        }

        private void EnsureActionable(DateTime now)
        {
            switch (Status)
            {
                case AdmissionStatus.CONFIRMED:
                    throw new BusinessRuleException("A confirmed admission cannot be modified.");
                case AdmissionStatus.CANCELLED:
                    throw new BusinessRuleException("This hold has already been cancelled.");
                case AdmissionStatus.EXPIRED:
                    throw new BusinessRuleException("This hold has expired.");
            }

            // Status is still HELD in the DB, but the time has passed
            if (ExpiresAt <= now)
                throw new BusinessRuleException("This hold has expired.");
        }
    }
}