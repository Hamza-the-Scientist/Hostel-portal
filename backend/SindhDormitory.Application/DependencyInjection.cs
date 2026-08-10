using Microsoft.Extensions.DependencyInjection;
using SindhDormitory.Application.Interfaces;
using SindhDormitory.Application.Services;

namespace SindhDormitory.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IPublicService, PublicService>();
        services.AddScoped<IStudentProfileService, StudentProfileService>();
        services.AddScoped<IEligibilityService, EligibilityService>();
        services.AddScoped<IApplicationService, ApplicationService>();
        services.AddScoped<IResidencyService, ResidencyService>();

        // Phase 7 — Merit & Allocation Engine
        services.AddScoped<IMeritService, MeritService>();
        services.AddScoped<IAllocationService, AllocationService>();
        services.AddScoped<IFinalChallanService, FinalChallanService>();

        return services;
    }

}
