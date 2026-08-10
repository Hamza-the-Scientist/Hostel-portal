// =============================================================================
// Domain/Entities/Student.cs
// =============================================================================
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class Student : SoftDeletableEntity
{
    public int    StudentId          { get; set; }
    public int    UserId             { get; set; }
    public string RegistrationNumber { get; set; } = string.Empty;
    public string Cnic               { get; set; } = string.Empty;  // 13-digit, stored without dashes
    public Gender Gender             { get; set; }
    public DateOnly DateOfBirth      { get; set; }
    public int?   DistrictId        { get; set; }

    // Navigation
    public User                    User                    { get; set; } = null!;
    public District?               District                { get; set; }
    public StudentProfile?         Profile                 { get; set; }
    public UniversityStudentRecord? UniversityRecord       { get; set; }
    public ICollection<Application>  Applications          { get; set; } = [];
    public ICollection<Allocation>   Allocations           { get; set; } = [];
}
