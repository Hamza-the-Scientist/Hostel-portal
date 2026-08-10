using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Application.DTOs.Verification;

public class UniversityVerificationResult
{
    public string FullName { get; set; } = string.Empty;
    public string Cnic { get; set; } = string.Empty;
    public string RollNumber { get; set; } = string.Empty;
    public string FatherName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string DistrictName { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string ProgramName { get; set; } = string.Empty;
    public DegreeType DegreeType { get; set; }
    public int Semester { get; set; }
    public decimal Cgpa { get; set; }
    public string AcademicYear { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string? ProfilePictureUrl { get; set; }
}
