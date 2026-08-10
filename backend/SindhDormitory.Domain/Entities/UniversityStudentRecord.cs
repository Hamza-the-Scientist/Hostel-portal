// =============================================================================
// Domain/Entities/UniversityStudentRecord.cs
// =============================================================================
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class UniversityStudentRecord : BaseEntity
{
    public int      RecordId      { get; set; }
    public int      StudentId     { get; set; }
    public int?     ProgramId     { get; set; }
    public int?     DepartmentId  { get; set; }
    public int      Semester      { get; set; }
    public decimal  Cgpa          { get; set; }
    public bool     IsVerified    { get; set; } = false;
    public DateTime? VerifiedAt   { get; set; }
    public string?  VerifiedBy    { get; set; }  // Admin username

    // Navigation
    public Student    Student    { get; set; } = null!;
    public Program?   Program    { get; set; }
    public Department? Department { get; set; }
}
