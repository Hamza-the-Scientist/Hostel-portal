// =============================================================================
// Domain/Entities/DistrictSeatRule.cs
// Configurable per-district seat quotas.
// HostelId = null means the quota applies across all hostels.
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class DistrictSeatRule : BaseEntity
{
    public int  RuleId         { get; set; }
    public int  AcademicYearId { get; set; }
    public int  DistrictId     { get; set; }
    public int? HostelId       { get; set; }   // null = global (all hostels)

    /// <summary>Number of seats reserved for this district.</summary>
    public int  ReservedSeats  { get; set; } = 0;

    public bool IsActive       { get; set; } = true;

    // Navigation
    public AcademicYear  AcademicYear { get; set; } = null!;
    public District      District     { get; set; } = null!;
    public Hostel?       Hostel       { get; set; }
}
