// =============================================================================
// Domain/Entities/ApplicationStatusHistory.cs
// =============================================================================
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class ApplicationStatusHistory : BaseEntity
{
    public int               HistoryId     { get; set; }
    public int               ApplicationId { get; set; }
    public ApplicationStatus OldStatus     { get; set; }
    public ApplicationStatus NewStatus     { get; set; }
    public string?           Remarks       { get; set; }
    public int?              ChangedByUserId { get; set; }  // Admin or system (null = system)
    public DateTime          ChangedAt     { get; set; } = DateTime.UtcNow;

    // Navigation
    public Application Application { get; set; } = null!;
}
