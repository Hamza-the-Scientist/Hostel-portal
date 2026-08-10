// =============================================================================
// Domain/Entities/StudentProfile.cs
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class StudentProfile : BaseEntity
{
    public int     ProfileId       { get; set; }
    public int     StudentId       { get; set; }
    public string? PhotoUrl        { get; set; }
    public string? GuardianName    { get; set; }
    public string? GuardianPhone   { get; set; }
    public string? GuardianRelation{ get; set; }
    public string? HomeAddress     { get; set; }
    public string? City            { get; set; }
    public string? EmergencyContact{ get; set; }
    public string? BloodGroup      { get; set; }
    public string? Disabilities    { get; set; }  // Optional, for special accommodation

    // Navigation
    public Student Student { get; set; } = null!;
}
