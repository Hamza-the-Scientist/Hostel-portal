// =============================================================================
// Domain/Entities/User.cs
// =============================================================================
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class User : SoftDeletableEntity
{
    public int    UserId       { get; set; }
    public string Email        { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName    { get; set; } = string.Empty;
    public string LastName     { get; set; } = string.Empty;
    public UserRole Role       { get; set; }
    public bool   IsActive     { get; set; } = true;
    public string? PhoneNumber { get; set; }
    public DateTime? LastLoginAt { get; set; }

    // Navigation
    public Student? Student              { get; set; }
    public Admin?   Admin                { get; set; }
    public ICollection<Notification> Notifications { get; set; } = [];
    public ICollection<AuditLog>     AuditLogs     { get; set; } = [];
}
