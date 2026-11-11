using Microsoft.EntityFrameworkCore;
using SchoolAdmissionSystem.Domain.Entities;


namespace SchoolAdmissionSystem.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<SchoolClass> SchoolClasses => Set<SchoolClass>();

        public DbSet<AdmissionHold> AdmissionHold => Set<AdmissionHold>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(ApplicationDbContext).Assembly);


            modelBuilder.Entity<AdmissionHold>(entity =>
            {
                entity.Property(h => h.Version).IsRowVersion();

                entity.HasOne(h => h.Class)
                      .WithMany(c => c.Holds)
                      .HasForeignKey(h => h.ClassId);
            });
        }


    }
}
