// =============================================================================
// Infrastructure/DependencyInjection.cs
// =============================================================================
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SindhDormitory.Application.Interfaces;
using SindhDormitory.Infrastructure.Persistence;
using SindhDormitory.Infrastructure.Services;
using System.Net.Sockets;

namespace SindhDormitory.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddScoped<IApplicationDbContext>(provider => 
            provider.GetRequiredService<ApplicationDbContext>());

        services.AddScoped<IUniversityVerificationService, SimulatedUniversityVerificationService>();
        services.AddScoped<IFileUploadService, FileUploadService>();

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Server=localhost;Database=SindhDormitoryDb;User=root;Password=;";

        // Check if MySQL server is reachable on port 3306
        bool isMySqlAvailable = IsServerPortOpen("localhost", 3306, 1500);

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            if (isMySqlAvailable)
            {
                options.UseMySql(
                    connectionString,
                    new MySqlServerVersion(new Version(8, 0, 31)),
                    mySqlOptions => mySqlOptions
                        .MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)
                        .EnableRetryOnFailure(maxRetryCount: 3, maxRetryDelay: TimeSpan.FromSeconds(5), errorNumbersToAdd: null)
                );
            }
            else
            {
                // Fallback to local SQLite database when MySQL server (XAMPP/MySQL Service) is not running
                var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "SindhDormitoryDb.db");
                options.UseSqlite($"Data Source={dbPath}");
            }
        });

        return services;
    }

    private static bool IsServerPortOpen(string host, int port, int timeoutMs)
    {
        try
        {
            using var client = new TcpClient();
            var result = client.BeginConnect(host, port, null, null);
            bool success = result.AsyncWaitHandle.WaitOne(timeoutMs, false);
            if (success && client.Connected)
            {
                client.EndConnect(result);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }
}
