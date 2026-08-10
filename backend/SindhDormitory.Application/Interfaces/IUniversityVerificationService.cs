using SindhDormitory.Application.DTOs.Verification;

namespace SindhDormitory.Application.Interfaces;

public interface IUniversityVerificationService
{
    Task<UniversityVerificationResult?> VerifyStudentAsync(string cnic, string rollNumber);
}
