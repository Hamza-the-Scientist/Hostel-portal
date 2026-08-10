using Microsoft.EntityFrameworkCore;
using SindhDormitory.Application.DTOs.Verification;
using SindhDormitory.Application.Interfaces;

namespace SindhDormitory.Infrastructure.Services;

public class SimulatedUniversityVerificationService : IUniversityVerificationService
{
    private readonly IApplicationDbContext _context;

    public SimulatedUniversityVerificationService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UniversityVerificationResult?> VerifyStudentAsync(string cnic, string rollNumber)
    {
        var cleanCnic = cnic.Replace("-", "").Trim();
        var cleanRoll = rollNumber.Trim();

        var record = await _context.SimulatedUniversityRecords
            .FirstOrDefaultAsync(r => r.Cnic == cleanCnic && r.RollNumber.ToLower() == cleanRoll.ToLower() && r.IsActive);

        if (record == null) return null;

        return new UniversityVerificationResult
        {
            FullName = record.FullName,
            Cnic = record.Cnic,
            RollNumber = record.RollNumber,
            FatherName = record.FatherName,
            Address = record.Address,
            DistrictName = record.DistrictName,
            Province = record.Province,
            DepartmentName = record.DepartmentName,
            ProgramName = record.ProgramName,
            DegreeType = record.DegreeType,
            Semester = record.Semester,
            Cgpa = record.Cgpa,
            AcademicYear = record.AcademicYear,
            Gender = record.Gender,
            DateOfBirth = record.DateOfBirth,
            ProfilePictureUrl = record.ProfilePictureUrl
        };
    }
}
