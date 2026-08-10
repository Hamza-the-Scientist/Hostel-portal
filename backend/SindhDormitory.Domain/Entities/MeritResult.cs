// =============================================================================
// Domain/Entities/MeritResult.cs
// =============================================================================
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class MeritResult : BaseEntity
{
    public int      MeritId          { get; set; }
    public int      ApplicationId    { get; set; }
    public int?     CycleId          { get; set; }   // FK to AllocationCycle

    // ── Merit scores ──────────────────────────────────────────────────────────
    public decimal  Cpn              { get; set; }   // Entry test / CPN score
    public decimal? Cgpa             { get; set; }   // Null for first-year applicants
    public decimal  MeritScore       { get; set; }   // Computed final score
    public int      MeritRank        { get; set; }   // 1 = highest merit

    // ── Eligibility & status ──────────────────────────────────────────────────
    public bool             IsEligible       { get; set; } = true;
    public AllocationStatus AllocationStatus { get; set; } = AllocationStatus.Pending;

    // ── Denormalized snapshot fields (captured at time of run) ────────────────
    public string?  Department   { get; set; }
    public string?  Program      { get; set; }
    public string?  AcademicYear { get; set; }
    public string?  District     { get; set; }
    public string?  Gender       { get; set; }
    public string?  RollNumber   { get; set; }

    // ── Allocation result (populated after allocation run) ────────────────────
    public int?     AllocatedHostelId { get; set; }
    public string?  AllocatedHostel   { get; set; }
    public string?  AllocatedRoom     { get; set; }
    public string?  AllocatedBed      { get; set; }

    public bool      IsFinalized  { get; set; } = false;
    public DateTime? FinalizedAt  { get; set; }

    // Navigation
    public Application     Application     { get; set; } = null!;
    public AllocationCycle? Cycle           { get; set; }
}
