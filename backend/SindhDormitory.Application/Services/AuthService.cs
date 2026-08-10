using Microsoft.EntityFrameworkCore;
using SindhDormitory.Application.DTOs.Auth;
using SindhDormitory.Application.Interfaces;
using SindhDormitory.Domain.Entities;
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Application.Services;

public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IUniversityVerificationService _verificationService;

    public AuthService(
        IApplicationDbContext context,
        IJwtTokenGenerator jwtTokenGenerator,
        IUniversityVerificationService verificationService)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
        _verificationService = verificationService;
    }

    public async Task<AuthResponse> LoginStudentAsync(StudentLoginRequest request)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Cnic == request.Cnic);

        if (student == null || student.User == null)
            throw new UnauthorizedAccessException("Invalid CNIC or password.");

        bool isValidPassword = BCrypt.Net.BCrypt.Verify(request.Password, student.User.PasswordHash);
        if (!isValidPassword)
            throw new UnauthorizedAccessException("Invalid CNIC or password.");

        if (student.User.Role != UserRole.Student)
            throw new UnauthorizedAccessException("Invalid role.");

        await LogLoginAttempt(student.UserId);

        var token = _jwtTokenGenerator.GenerateToken(student.User);

        return new AuthResponse
        {
            Token = token,
            UserId = student.UserId,
            Email = student.User.Email,
            FirstName = student.User.FirstName,
            LastName = student.User.LastName,
            Role = student.User.Role
        };
    }

    public async Task<AuthResponse> LoginAdminAsync(AdminLoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
            throw new UnauthorizedAccessException("Invalid email or password.");

        bool isValidPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isValidPassword)
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (user.Role != UserRole.Admin && user.Role != UserRole.SuperAdmin)
            throw new UnauthorizedAccessException("Unauthorized access.");

        await LogLoginAttempt(user.UserId);

        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            UserId = user.UserId,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role
        };
    }

    public async Task<AuthResponse> RegisterStudentAsync(RegisterStudentRequest request)
    {
        // 1. Verification Step against Simulated University DB
        var verificationResult = await _verificationService.VerifyStudentAsync(request.Cnic, request.RegistrationNumber);
        if (verificationResult == null)
        {
            throw new InvalidOperationException("Only verified University of Sindh students are eligible to register.");
        }

        var existingUser = await _context.Users.AnyAsync(u => u.Email == request.Email);
        if (existingUser)
            throw new InvalidOperationException("Email is already registered.");

        var existingStudent = await _context.Students.AnyAsync(s => s.Cnic == verificationResult.Cnic || s.RegistrationNumber == verificationResult.RollNumber);
        if (existingStudent)
            throw new InvalidOperationException("CNIC or Roll Number is already registered.");

        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Auto-split name from official record if possible
        var nameParts = verificationResult.FullName.Split(' ', 2);
        string firstName = nameParts.Length > 0 ? nameParts[0] : verificationResult.FullName;
        string lastName = nameParts.Length > 1 ? nameParts[1] : string.Empty;

        var user = new User
        {
            Email = request.Email,
            PasswordHash = hashedPassword,
            FirstName = firstName,
            LastName = lastName,
            PhoneNumber = request.PhoneNumber,
            Role = UserRole.Student,
            IsActive = true
        };

        var student = new Student
        {
            User = user,
            Cnic = verificationResult.Cnic,
            RegistrationNumber = verificationResult.RollNumber,
            Gender = verificationResult.Gender,
            DateOfBirth = verificationResult.DateOfBirth,
            Profile = new StudentProfile
            {
                HomeAddress = verificationResult.Address,
                City = verificationResult.DistrictName,
                PhotoUrl = verificationResult.ProfilePictureUrl
            },
            UniversityRecord = new UniversityStudentRecord
            {
                Semester = verificationResult.Semester,
                Cgpa = verificationResult.Cgpa,
                IsVerified = true,
                VerifiedAt = DateTime.UtcNow,
                VerifiedBy = "SYSTEM_VERIFICATION_GATE"
            }
        };

        _context.Users.Add(user);
        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            UserId = user.UserId,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role
        };
    }

    private async Task LogLoginAttempt(int userId)
    {
        var auditLog = new AuditLog
        {
            TableName = "User",
            RecordId = userId.ToString(),
            Action = AuditAction.Update,
            PerformedByUserId = userId,
            PerformedAt = DateTime.UtcNow,
            NewValues = "{\"Action\": \"Login\"}"
        };

        _context.AuditLogs.Add(auditLog);
        await _context.SaveChangesAsync();
    }
}
