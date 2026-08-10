using SindhDormitory.Application.DTOs.Application;

namespace SindhDormitory.Application.Interfaces;

public interface IApplicationService
{
    Task<ApplicationDto> GetOrCreateActiveApplicationAsync(int userId);
    Task<ApplicationDto> SubmitHostelPreferencesAsync(int userId, UpdatePreferencesRequest request);
    Task<ProcessingFeeChallanDto> GenerateProcessingFeeChallanAsync(int userId);
    Task<ApplicationDto> VerifyProcessingFeeAsync(int userId, VerifyPaymentRequest request);
    Task<ApplicationDto> SubmitFinalApplicationAsync(int userId);
}
