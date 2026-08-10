using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class SimulatedUniversityRecord : BaseEntity
{
    public int RecordId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Cnic { get; set; } = string.Empty; // 13 digits
    public string RollNumber { get; set; } = string.Empty;
    public string FatherName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string DistrictName { get; set; } = string.Empty;
    public string Province { get; set; } = "Sindh";
    public string DepartmentName { get; set; } = string.Empty;
    public string ProgramName { get; set; } = string.Empty;
    public DegreeType DegreeType { get; set; }
    public int Semester { get; set; }
    public decimal Cgpa { get; set; }

    /// <summary>
    /// CPN / Entry-test score (0–200 scale, as used by Sindh University admission system).
    /// This is the primary merit criterion for first-year applicants.
    /// </summary>
    public decimal Cpn { get; set; } = 0m;

    public string AcademicYear { get; set; } = "2025-2026";
    public Gender Gender { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public bool IsActive { get; set; } = true;
}
