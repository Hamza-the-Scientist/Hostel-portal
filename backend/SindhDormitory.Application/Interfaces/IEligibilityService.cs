using SindhDormitory.Application.DTOs.Application;
using SindhDormitory.Domain.Entities;

namespace SindhDormitory.Application.Interfaces;

public interface IEligibilityService
{
    Task<List<EligibleHostelDto>> GetEligibleHostelsForStudentAsync(int studentId);
    Task<bool> IsStudentEligibleForHostelAsync(int studentId, int hostelId);
}
