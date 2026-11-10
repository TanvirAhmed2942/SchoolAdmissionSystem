using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SchoolAdmissionSystem.Domain.Entities;

namespace SchoolAdmissionSystem.Infrastructure.Persistence
{
    public class SchoolClassConfiguration
    : IEntityTypeConfiguration<SchoolClass>
    {
        public void Configure(EntityTypeBuilder<SchoolClass> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.TotalSeats)
                .IsRequired();
        }
    }
}
