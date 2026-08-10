// =============================================================================
// Infrastructure/DependencyInjection.cs
// =============================================================================
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SindhDormitory.Application.Interfaces;
using SindhDormitory.Infrastructure.Persistence;
using SindhDormitory.Infrastructure.Services;

namespace SindhDormitory.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ── MySQL / EF Core ───────────────────────────────────────────────────
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "Connection string 'DefaultConnection' is not configured. " +
                "Set it in appsettings.Development.json or as an environment variable " +
                "ConnectionStrings__DefaultConnection");

        services.AddScoped<IApplicationDbContext>(provider => 
            provider.GetRequiredService<ApplicationDbContext>());

        services.AddScoped<IUniversityVerificationService, SimulatedUniversityVerificationService>();
        services.AddScoped<IFileUploadService, FileUploadService>();

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseMySql(
                connectionString,
                new MySqlServerVersion(new Version(8, 0, 31)),
                mySqlOptions => mySqlOptions
                    .MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)
                    .EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(30),
                        errorNumbersToAdd: null)
            )
        );

        return services;
    }
}
