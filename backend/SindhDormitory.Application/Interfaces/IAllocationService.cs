// =============================================================================
// Application/Interfaces/IAllocationService.cs
// =============================================================================
using SindhDormitory.Application.DTOs.Merit;

namespace SindhDormitory.Application.Interfaces;

public interface IAllocationService
{
    /// <summary>
    /// Runs the first-round room allocation for a given merit cycle.
    /// Processes applicants in merit rank order, respects preferences, gender rules,
    /// and district quotas. Idempotent — safe to call twice.
    /// </summary>
    Task<AllocationRunResultDto> RunAllocationAsync(int cycleId, int adminUserId);

    /// <summary>
    /// Second-round: frees unpaid/expired final challans, then re-allocates
    /// waitlisted students using freed seats. Creates a new IsSecondRound=true cycle.
    /// </summary>
    Task<AllocationRunResultDto> RunSecondRoundAllocationAsync(int academicYearId, int adminUserId);

    /// <summary>Returns district-wise seat distribution stats for an academic year.</summary>
    Task<DistrictStatsDto> GetDistrictStatsAsync(int academicYearId);
}
