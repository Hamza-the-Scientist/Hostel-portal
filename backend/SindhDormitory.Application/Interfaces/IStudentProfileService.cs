using SindhDormitory.Application.DTOs.Profile;

namespace SindhDormitory.Application.Interfaces;

public interface IStudentProfileService
{
    Task<StudentProfileDto> GetProfileByUserIdAsync(int userId);
    Task<StudentProfileDto> UpdateProfileByUserIdAsync(int userId, UpdateStudentProfileRequest request);
}
