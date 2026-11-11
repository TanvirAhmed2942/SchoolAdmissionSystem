namespace SchoolAdmissionSystem.Domain.Entities
{
    public class SchoolClass
    {


        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public int TotalSeats { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }

        public ICollection<AdmissionHold> Holds { get; set; }
            = new List<AdmissionHold>();


    }
}
