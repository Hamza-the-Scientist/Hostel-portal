// =============================================================================
// Domain/Entities/Department.cs
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class Department : BaseEntity
{
    public int    DepartmentId { get; set; }
    public string Name         { get; set; } = string.Empty;
    public string Code         { get; set; } = string.Empty;  // e.g. "CS", "EE"

    // Navigation
    public ICollection<Program>                 Programs               { get; set; } = [];
    public ICollection<UniversityStudentRecord> UniversityStudentRecords { get; set; } = [];
}
