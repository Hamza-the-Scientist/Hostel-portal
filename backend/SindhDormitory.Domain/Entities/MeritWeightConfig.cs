// =============================================================================
// Domain/Entities/MeritWeightConfig.cs
// Configurable merit scoring weights per academic year.
// Admin can update these without any code changes.
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class MeritWeightConfig : BaseEntity
{
    public int     ConfigId       { get; set; }
    public int     AcademicYearId { get; set; }

    /// <summary>When true, CPN is the sole criterion (first-year / new entrants).</summary>
    public bool    IsFirstYearRule { get; set; } = false;

    /// <summary>Weight applied to CPN score (0.0 – 1.0). Example: 0.6</summary>
    public decimal CpnWeight      { get; set; } = 0.6m;

    /// <summary>Weight applied to CGPA (normalised ×10 to 100-pt scale). Example: 0.4</summary>
    public decimal CgpaWeight     { get; set; } = 0.4m;

    public bool    IsActive       { get; set; } = true;
    public string? Notes          { get; set; }

    // Navigation
    public AcademicYear AcademicYear { get; set; } = null!;
}
