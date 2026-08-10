// =============================================================================
// Application/DTOs/Merit/MeritDtos.cs
// =============================================================================
namespace SindhDormitory.Application.DTOs.Merit;

// ── Merit Engine ──────────────────────────────────────────────────────────────

public class RunMeritRequest
{
    public int AcademicYearId { get; set; }
}

public class MeritRunResultDto
{
    public int     CycleId          { get; set; }
    public int     TotalProcessed   { get; set; }
    public int     Eligible         { get; set; }
    public int     Ineligible       { get; set; }
    public DateTime RanAt           { get; set; }
    public string  Message          { get; set; } = string.Empty;
}

// ── Student Merit Card ────────────────────────────────────────────────────────

public class MeritResultDto
{
    public int     MeritId          { get; set; }
    public int     ApplicationId    { get; set; }

    // ── Student identity ──
    public string  StudentName      { get; set; } = string.Empty;
    public string  RollNumber       { get; set; } = string.Empty;
    public string  Department       { get; set; } = string.Empty;
    public string  Program          { get; set; } = string.Empty;
    public string  AcademicYear     { get; set; } = string.Empty;
    public string  Gender           { get; set; } = string.Empty;
    public string  District         { get; set; } = string.Empty;

    // ── Merit data ──
    public decimal Cpn              { get; set; }
    public decimal? Cgpa            { get; set; }
    public decimal MeritScore       { get; set; }
    public int     MeritRank        { get; set; }
    public int     TotalApplicants  { get; set; }
    public bool    IsEligible        { get; set; }

    // ── Allocation result ──
    public string  AllocationStatus  { get; set; } = string.Empty;
    public string  ApplicationStatus { get; set; } = string.Empty;
    public string? PreferredHostel   { get; set; }
    public string? AllocatedHostel   { get; set; }
    public string? AllocatedRoom     { get; set; }
    public string? AllocatedBed      { get; set; }

    // ── Final challan ──
    public FinalChallanDto? FinalChallan { get; set; }
}

// ── Allocation Engine ─────────────────────────────────────────────────────────

public class RunAllocationRequest
{
    public int CycleId        { get; set; }
}

public class RunSecondRoundRequest
{
    public int AcademicYearId { get; set; }
}

public record AllocationRunResultDto
{
    public int    CycleId         { get; init; }
    public bool   IsSecondRound   { get; init; }
    public int    TotalAllocated  { get; init; }
    public int    TotalWaitlisted { get; init; }
    public int    TotalRejected   { get; init; }
    public int    FreedSeats      { get; init; }  // Second round only
    public DateTime RanAt         { get; init; }
    public string Message         { get; init; } = string.Empty;
}

// ── District Stats ────────────────────────────────────────────────────────────

public class DistrictStatDto
{
    public int    DistrictId        { get; set; }
    public string DistrictName      { get; set; } = string.Empty;
    public int    TotalApplicants   { get; set; }
    public int    ReservedSeats     { get; set; }
    public int    AllocatedSeats    { get; set; }
    public int    WaitlistedCount   { get; set; }
    public int    RemainingSeats    { get; set; }
}

public class DistrictStatsDto
{
    public int                  AcademicYearId { get; set; }
    public string               AcademicYear   { get; set; } = string.Empty;
    public List<DistrictStatDto> Districts      { get; set; } = [];
}

// ── Final Hostel Challan ──────────────────────────────────────────────────────

public class FinalChallanDto
{
    public int      ChallanId      { get; set; }
    public string   ChallanNumber  { get; set; } = string.Empty;
    public decimal  Amount         { get; set; }
    public string   Status         { get; set; } = string.Empty;
    public DateTime GeneratedAt    { get; set; }
    public DateTime ExpiresAt      { get; set; }
    public bool     IsExpired      { get; set; }

    // Allocation context
    public string?  AllocatedHostel { get; set; }
    public string?  AllocatedRoom   { get; set; }
    public string?  AllocatedBed    { get; set; }
}

public class ChallanListDto
{
    public FinalChallanDto? ProcessingFeeChallan { get; set; }
    public FinalChallanDto? FinalHostelChallan   { get; set; }
}
