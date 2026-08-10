// =============================================================================
// Domain/Entities/Admin.cs
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class Admin : BaseEntity
{
    public int    AdminId    { get; set; }
    public int    UserId     { get; set; }
    public string EmployeeId { get; set; } = string.Empty;
    public string? Department { get; set; }

    // Navigation
    public User                    User          { get; set; } = null!;
    public ICollection<Announcement> Announcements { get; set; } = [];
}
