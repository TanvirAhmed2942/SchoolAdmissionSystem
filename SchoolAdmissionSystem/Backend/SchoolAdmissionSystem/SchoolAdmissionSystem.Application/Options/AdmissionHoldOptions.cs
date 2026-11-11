namespace SchoolAdmissionSystem.Application.Options
{
    public class AdmissionHoldOptions
    {
        public const string SectionName = "AdmissionHold";

        public int HoldDurationMinutes { get; set; } = 10;
        public int ExpiryCheckIntervalSeconds { get; set; } = 60;
    }
}