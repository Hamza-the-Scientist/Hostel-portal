// =============================================================================
// Domain/Entities/AuditLog.cs
// =============================================================================
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class AuditLog
{
    public long        LogId       { get; set; }
    public string      TableName   { get; set; } = string.Empty;
    public string      RecordId    { get; set; } = string.Empty;  // String to handle any PK type
    public AuditAction Action      { get; set; }
    public string?     OldValues   { get; set; }  // JSON
    public string?     NewValues   { get; set; }  // JSON
    public int?        PerformedByUserId { get; set; }
    public DateTime    PerformedAt { get; set; } = DateTime.UtcNow;
    public string?     IpAddress   { get; set; }
    public string?     UserAgent   { get; set; }

    // Navigation
    public User? PerformedBy { get; set; }
}
