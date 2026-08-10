// =============================================================================
// Application/Interfaces/IMeritService.cs
// =============================================================================
using SindhDormitory.Application.DTOs.Merit;

namespace SindhDormitory.Application.Interfaces;

public interface IMeritService
{
    /// <summary>
    /// Computes merit scores and ranks for all eligible fresh applicants
    /// in the given academic year. Creates a new AllocationCycle and upserts MeritResults.
    /// Idempotent within a cycle.
    /// </summary>
    Task<MeritRunResultDto> RunMeritAsync(int academicYearId, int adminUserId);

    /// <summary>Returns the full merit card for the currently logged-in student.</summary>
    Task<MeritResultDto> GetStudentMeritResultAsync(int userId);
}
