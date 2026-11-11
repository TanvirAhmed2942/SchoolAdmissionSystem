using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SchoolAdmissionSystem.Application.Interfaces;
using SchoolAdmissionSystem.Infrastructure.Persistence;
using SchoolAdmissionSystem.Infrastructure.Repositories;

namespace SchoolAdmissionSystem.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Singletons because the repositories keep their data in memory.
            // Switch to scoped when they are backed by a real database (e.g. EF Core DbContext).
            services.AddScoped<IAdminRepository, AdminRepository>();
            services.AddScoped<ICandidateRepository, CandidateRepository>();
            //services.AddHostedService<HoldExpiryWorker>();
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            return services;
        }
    }
}
