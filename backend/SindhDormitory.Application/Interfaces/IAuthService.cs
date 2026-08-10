using SindhDormitory.Application.DTOs.Auth;

namespace SindhDormitory.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginStudentAsync(StudentLoginRequest request);
    Task<AuthResponse> LoginAdminAsync(AdminLoginRequest request);
    Task<AuthResponse> RegisterStudentAsync(RegisterStudentRequest request);
}
