// =============================================================================
// API/Program.cs — Application entry point with full middleware stack & DB Seeding
// =============================================================================
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SindhDormitory.Application;
using SindhDormitory.Infrastructure;
using SindhDormitory.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// ── Controllers ───────────────────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(opts => opts.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);

// ── Swagger / OpenAPI ─────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title       = "Sindh University Dormitory Portal API",
        Version     = "v1",
        Description = "Backend API for the University of Sindh Hostel Management System"
    });
    // Add JWT auth to Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name         = "Authorization",
        Type         = SecuritySchemeType.ApiKey,
        Scheme       = "Bearer",
        BearerFormat = "JWT",
        In           = ParameterLocation.Header,
        Description  = "Enter: Bearer {your JWT token}"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// ── JWT Authentication ────────────────────────────────────────────────────────
var jwtSecret = builder.Configuration["Jwt:Secret"]
    ?? throw new InvalidOperationException("Jwt:Secret is not configured.");
var jwtIssuer   = builder.Configuration["Jwt:Issuer"]   ?? "SindhDormitoryPortal";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "SindhDormitoryPortal";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtIssuer,
            ValidAudience            = jwtAudience,
            IssuerSigningKey         = new SymmetricSecurityKey(
                                           Encoding.UTF8.GetBytes(jwtSecret)),
            ClockSkew                = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ── CORS ──────────────────────────────────────────────────────────────────────
var frontendUrl = builder.Configuration["App:FrontendUrl"] ?? "http://localhost:4200";
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
        policy.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// ── Infrastructure (EF Core + MySQL) ─────────────────────────────────────────
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();

// ── Health Checks ─────────────────────────────────────────────────────────────
builder.Services.AddHealthChecks();

// ═════════════════════════════════════════════════════════════════════════════
var app = builder.Build();
// ═════════════════════════════════════════════════════════════════════════════

// ── Seed Demo Data on Startup ────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        await DbInitializer.SeedAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json",
        "Sindh Dormitory Portal API v1"));
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("AllowAngularDev");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
