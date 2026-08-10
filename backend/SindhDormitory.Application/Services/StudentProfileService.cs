using Microsoft.EntityFrameworkCore;
using SindhDormitory.Application.DTOs.Profile;
using SindhDormitory.Application.Interfaces;
using SindhDormitory.Domain.Entities;

namespace SindhDormitory.Application.Services;

public class StudentProfileService : IStudentProfileService
{
    private readonly IApplicationDbContext _context;

    public StudentProfileService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StudentProfileDto> GetProfileByUserIdAsync(int userId)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .Include(s => s.Profile)
            .Include(s => s.UniversityRecord)
                .ThenInclude(u => u!.Department)
            .Include(s => s.UniversityRecord)
                .ThenInclude(u => u!.Program)
            .Include(s => s.District)
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
            throw new KeyNotFoundException("Student profile not found.");

        var record = student.UniversityRecord;
        var profile = student.Profile;

        return new StudentProfileDto
        {
            StudentId = student.StudentId,
            VerifiedInfo = new VerifiedUniversityInfoDto
            {
                FullName = $"{student.User.FirstName} {student.User.LastName}".Trim(),
                RollNumber = student.RegistrationNumber,
                Cnic = student.Cnic,
                Department = record?.Department?.Name ?? "N/A",
                Program = record?.Program?.Name ?? "N/A",
                Semester = record?.Semester ?? 0,
                Cgpa = record?.Cgpa ?? 0m,
                AcademicYear = "2025-2026",
                District = student.District?.Name ?? "N/A",
                Gender = student.Gender.ToString(),
                DateOfBirth = student.DateOfBirth.ToString("yyyy-MM-dd")
            },
            PersonalInfo = new PersonalInfoDto
            {
                Email = student.User.Email,
                PhoneNumber = student.User.PhoneNumber ?? string.Empty,
                ProfilePictureUrl = profile?.PhotoUrl,
                GuardianName = profile?.GuardianName,
                GuardianPhone = profile?.GuardianPhone,
                GuardianRelation = profile?.GuardianRelation,
                HomeAddress = profile?.HomeAddress,
                City = profile?.City,
                EmergencyContact = profile?.EmergencyContact,
                BloodGroup = profile?.BloodGroup,
                Disabilities = profile?.Disabilities
            }
        };
    }

    public async Task<StudentProfileDto> UpdateProfileByUserIdAsync(int userId, UpdateStudentProfileRequest request)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .Include(s => s.Profile)
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
            throw new KeyNotFoundException("Student profile not found.");

        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            student.User.PhoneNumber = request.PhoneNumber;
        }

        if (student.Profile == null)
        {
            student.Profile = new StudentProfile { StudentId = student.StudentId };
            _context.StudentProfiles.Add(student.Profile);
        }

        student.Profile.PhotoUrl = request.ProfilePictureUrl ?? student.Profile.PhotoUrl;
        student.Profile.GuardianName = request.GuardianName ?? student.Profile.GuardianName;
        student.Profile.GuardianPhone = request.GuardianPhone ?? student.Profile.GuardianPhone;
        student.Profile.GuardianRelation = request.GuardianRelation ?? student.Profile.GuardianRelation;
        student.Profile.HomeAddress = request.HomeAddress ?? student.Profile.HomeAddress;
        student.Profile.City = request.City ?? student.Profile.City;
        student.Profile.EmergencyContact = request.EmergencyContact ?? student.Profile.EmergencyContact;
        student.Profile.BloodGroup = request.BloodGroup ?? student.Profile.BloodGroup;
        student.Profile.Disabilities = request.Disabilities ?? student.Profile.Disabilities;

        await _context.SaveChangesAsync();

        return await GetProfileByUserIdAsync(userId);
    }
}
