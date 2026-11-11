using Microsoft.EntityFrameworkCore;
namespace SchoolAdmissionSystem.Infrastructure.Persistence
{


    public class DatabaseDataCleaner
    {
        private readonly ApplicationDbContext _context;

        public DatabaseDataCleaner(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task ClearAllDataAsync()
        {
            await using var transaction =
                await _context.Database.BeginTransactionAsync();

            // Delete dependent entities first
            await _context.AdmissionHold.ExecuteDeleteAsync();
            await _context.SchoolClasses.ExecuteDeleteAsync();

            // Add your other DbSets here
            // await _context.Applications.ExecuteDeleteAsync();
            // await _context.Students.ExecuteDeleteAsync();

            await transaction.CommitAsync();
        }
    }
}
