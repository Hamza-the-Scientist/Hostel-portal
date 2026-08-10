// =============================================================================
// Domain/Entities/AllocationCycle.cs
// Idempotency anchor for each merit/allocation engine run.
// Running the engine twice with the same CycleId is a no-op.
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class AllocationCycle : BaseEntity
{
    public int      CycleId            { get; set; }
    public int      AcademicYearId     { get; set; }
    public int?     TriggeredByAdminId { get; set; }   // null = system
    public DateTime RunAt              { get; set; } = DateTime.UtcNow;
    public bool     IsSecondRound      { get; set; } = false;
    public string   Status             { get; set; } = "Running"; // Running | Completed | Failed
    public string?  Remarks            { get; set; }

    // Navigation
    public AcademicYear              AcademicYear  { get; set; } = null!;
    public ICollection<MeritResult>  MeritResults  { get; set; } = [];
    public ICollection<Allocation>   Allocations   { get; set; } = [];
}
