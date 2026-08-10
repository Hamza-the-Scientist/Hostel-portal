// =============================================================================
// Domain/Entities/Program.cs
// =============================================================================
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class Program : BaseEntity
{
    public int        ProgramId    { get; set; }
    public int        DepartmentId { get; set; }
    public string     Name         { get; set; } = string.Empty;
    public string     Code         { get; set; } = string.Empty;  // e.g. "BSCS", "MSEE"
    public DegreeType DegreeType   { get; set; }
    public int        TotalSemesters { get; set; }

    // Navigation
    public Department                        Department              { get; set; } = null!;
    public ICollection<UniversityStudentRecord> UniversityStudentRecords { get; set; } = [];
}
