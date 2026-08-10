// =============================================================================
// Domain/Entities/Allocation.cs
// Business rule: UNIQUE(StudentId, IsActive) + UNIQUE(BedId, IsActive)
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class Allocation : SoftDeletableEntity
{
    public int      AllocationId  { get; set; }
    public int      ApplicationId { get; set; }
    public int      StudentId     { get; set; }
    public int      BedId         { get; set; }
    public bool     IsActive      { get; set; } = true;
    public DateTime AllocatedAt   { get; set; } = DateTime.UtcNow;
    public DateTime? DeactivatedAt { get; set; }
    public int?     AllocatedByAdminId { get; set; }  // null = system allocation

    // Navigation
    public Application Application { get; set; } = null!;
    public Student     Student     { get; set; } = null!;
    public Bed         Bed         { get; set; } = null!;
    public Resident?   Resident    { get; set; }
}
