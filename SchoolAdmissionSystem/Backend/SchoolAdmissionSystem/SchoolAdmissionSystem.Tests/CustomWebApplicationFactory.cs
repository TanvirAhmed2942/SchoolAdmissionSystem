using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace SchoolAdmissionSystem.Tests
{
    public class CustomWebApplicationFactory(string connectionString)
        : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((context, config) =>
            {
                var settings = new Dictionary<string, string?>
            {
                {
                    "ConnectionStrings:DefaultConnection",
                    connectionString
                }
            };

                config.AddInMemoryCollection(settings);
            });
        }
    }
}
