// =============================================================================
// Domain/Entities/Notification.cs + Announcement.cs
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class Notification : BaseEntity
{
    public int    NotificationId { get; set; }
    public int    UserId         { get; set; }
    public string Title          { get; set; } = string.Empty;
    public string Message        { get; set; } = string.Empty;
    public bool   IsRead         { get; set; } = false;
    public string? Link          { get; set; }  // Optional deep-link within the portal
    public DateTime SentAt       { get; set; } = DateTime.UtcNow;
    public DateTime? ReadAt      { get; set; }

    // Navigation
    public User User { get; set; } = null!;
}

public class Announcement : BaseEntity
{
    public int      AnnouncementId { get; set; }
    public int      AdminId        { get; set; }
    public string   Title          { get; set; } = string.Empty;
    public string   Content        { get; set; } = string.Empty;
    public bool     IsPublished    { get; set; } = false;
    public DateTime? PublishedAt   { get; set; }
    public DateTime? ExpiresAt     { get; set; }
    public string?  TargetAudience { get; set; }  // "All", "Students", "Male", "Female", hostelId

    // Navigation
    public Admin Admin { get; set; } = null!;
}
