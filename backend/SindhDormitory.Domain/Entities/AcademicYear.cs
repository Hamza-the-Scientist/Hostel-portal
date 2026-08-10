// =============================================================================
// Domain/Entities/AcademicYear.cs
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class AcademicYear : BaseEntity
{
    public int      AcademicYearId { get; set; }
    public string   Label          { get; set; } = string.Empty;  // e.g. "2024-25"
    public DateOnly StartDate      { get; set; }
    public DateOnly EndDate        { get; set; }
    public bool     IsActive       { get; set; } = false;
    public DateTime? ApplicationOpenDate  { get; set; }
    public DateTime? ApplicationCloseDate { get; set; }

    // Navigation
    public ICollection<Application>  Applications  { get; set; } = [];
}
