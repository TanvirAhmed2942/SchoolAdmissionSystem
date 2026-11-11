using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SchoolAdmissionSystem.Application.Interfaces;
using SchoolAdmissionSystem.Application.Options;

namespace SchoolAdmissionSystem.Infrastructure.BackgroundServices
{
    public class HoldExpiryWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly AdmissionHoldOptions _options;
        private readonly ILogger<HoldExpiryWorker> _logger;

        public HoldExpiryWorker(
            IServiceScopeFactory scopeFactory,
            IOptions<AdmissionHoldOptions> options,
            ILogger<HoldExpiryWorker> logger)
        {
            _scopeFactory = scopeFactory;
            _options = options.Value;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var interval = TimeSpan.FromSeconds(_options.ExpiryCheckIntervalSeconds);
            using var timer = new PeriodicTimer(interval);

            do
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var repo = scope.ServiceProvider.GetRequiredService<ICandidateRepository>();
                    var expired = await repo.ExpireOverdueHoldsAsync(DateTime.UtcNow);

                    if (expired > 0)
                        _logger.LogInformation("Expired {Count} admission holds.", expired);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    _logger.LogError(ex, "Failed to expire admission holds.");
                }
            }
            while (await timer.WaitForNextTickAsync(stoppingToken));
        }
    }
}