// =============================================================================
// Application/Interfaces/IFinalChallanService.cs
// =============================================================================
using SindhDormitory.Application.DTOs.Merit;

namespace SindhDormitory.Application.Interfaces;

public interface IFinalChallanService
{
    /// <summary>Returns the final hostel challan for the currently logged-in student.</summary>
    Task<FinalChallanDto?> GetFinalChallanAsync(int userId);

    /// <summary>Returns both processing-fee and final hostel challans for a student.</summary>
    Task<ChallanListDto> GetAllChallansAsync(int userId);
}
