// =============================================================================
// Domain/Entities/Application.cs
// =============================================================================
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class Application : BaseEntity
{
    public int               ApplicationId  { get; set; }
    public int               StudentId      { get; set; }
    public int               AcademicYearId { get; set; }
    public ApplicationStatus Status         { get; set; } = ApplicationStatus.Draft;
    public DateTime?         SubmittedAt    { get; set; }
    public string?           Remarks        { get; set; }

    // Navigation
    public Student      Student      { get; set; } = null!;
    public AcademicYear AcademicYear { get; set; } = null!;
    public ICollection<ApplicationHostelPreference> Preferences    { get; set; } = [];
    public ICollection<ApplicationStatusHistory>    StatusHistory  { get; set; } = [];
    public MeritResult?  MeritResult  { get; set; }
    public ProcessingFee? ProcessingFee { get; set; }
    public ICollection<Allocation>   Allocations { get; set; } = [];
}
