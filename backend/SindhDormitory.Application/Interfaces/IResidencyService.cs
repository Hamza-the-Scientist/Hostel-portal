using SindhDormitory.Application.DTOs.Application;
using SindhDormitory.Application.DTOs.Residency;

namespace SindhDormitory.Application.Interfaces;

public interface IResidencyService
{
    Task<StudentResidencyDto> GetStudentResidencyAsync(int userId);
    Task<ProcessingFeeChallanDto> GenerateAnnualFeeChallanAsync(int userId);
    Task<StudentResidencyDto> VerifyAnnualFeePaymentAsync(int userId, VerifyPaymentRequest request);
    Task<RoomChangeRequestDto> CreateRoomChangeRequestAsync(int userId, CreateRoomChangeRequestDto dto);
    Task<List<RoomChangeRequestDto>> GetStudentRoomChangeRequestsAsync(int userId);
    Task<RoomChangeRequestDto> GetRoomChangeRequestByIdAsync(int userId, int requestId);
}
