// =============================================================================
// Application/Services/MeritService.cs
// =============================================================================
using Microsoft.EntityFrameworkCore;
using SindhDormitory.Application.DTOs.Merit;
using SindhDormitory.Application.Interfaces;
using SindhDormitory.Domain.Entities;
using SindhDormitory.Domain.Enums;
using ApplicationEntity = SindhDormitory.Domain.Entities.Application;

namespace SindhDormitory.Application.Services;

public class MeritService : IMeritService
{
    private readonly IApplicationDbContext _context;

    public MeritService(IApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================================
    // POST /api/admin/merit/run
    // =========================================================================
    public async Task<MeritRunResultDto> RunMeritAsync(int academicYearId, int adminUserId)
    {
        // ── 1. Load merit weight config ────────────────────────────────────────
        var weightConfig = await _context.MeritWeightConfigs
            .Where(c => c.AcademicYearId == academicYearId && c.IsActive)
            .OrderByDescending(c => c.CreatedAt)
            .FirstOrDefaultAsync()
            ?? new MeritWeightConfig
            {
                AcademicYearId  = academicYearId,
                IsFirstYearRule = false,
                CpnWeight       = 0.6m,
                CgpaWeight      = 0.4m
            };

        // ── 2. Create a new AllocationCycle ────────────────────────────────────
        var cycle = new AllocationCycle
        {
            AcademicYearId     = academicYearId,
            TriggeredByAdminId = adminUserId,
            RunAt              = DateTime.UtcNow,
            Status             = "Running"
        };
        _context.AllocationCycles.Add(cycle);
        await _context.SaveChangesAsync();

        // ── 3. Fetch eligible applications (Submitted / UnderReview) ───────────
        // "Fresh applicant" = has an Application but NO active Resident record
        var applications = await _context.Applications
            .Include(a => a.Student)
                .ThenInclude(s => s.User)
            .Include(a => a.Student)
                .ThenInclude(s => s.District)
            .Include(a => a.Student)
                .ThenInclude(s => s.UniversityRecord)
                    .ThenInclude(ur => ur!.Department)
            .Include(a => a.Student)
                .ThenInclude(s => s.UniversityRecord)
                    .ThenInclude(ur => ur!.Program)
            .Include(a => a.Preferences)
                .ThenInclude(p => p.Hostel)
            .Include(a => a.AcademicYear)
            .Where(a => a.AcademicYearId == academicYearId
                        && (a.Status == ApplicationStatus.Submitted
                            || a.Status == ApplicationStatus.UnderReview
                            || a.Status == ApplicationStatus.MeritListed))
            .ToListAsync();

        // Exclude students who are already existing residents
        var existingResidentStudentIds = await _context.Residents
            .Select(r => r.Allocation.StudentId)
            .ToListAsync();

        var freshApplicants = applications
            .Where(a => !existingResidentStudentIds.Contains(a.StudentId))
            .ToList();

        // ── 4. Load simulated university records (CPN + CGPA source) ──────────
        var studentCnics = freshApplicants
            .Select(a => a.Student.Cnic)
            .ToList();

        var simRecords = await _context.SimulatedUniversityRecords
            .Where(r => studentCnics.Contains(r.Cnic) && r.IsActive)
            .ToDictionaryAsync(r => r.Cnic);

        // ── 5. Compute merit scores ────────────────────────────────────────────
        var scoredApplicants = new List<(ApplicationEntity App, decimal Score, decimal Cpn, decimal? Cgpa, bool IsFirstYear)>();

        foreach (var app in freshApplicants)
        {
            var cnic = app.Student.Cnic;
            simRecords.TryGetValue(cnic, out var simRec);

            var cpn  = simRec?.Cpn  ?? 0m;
            var cgpa = simRec?.Cgpa;

            // First-year: Semester == 1 or admin configured as first-year rule
            var isFirstYear = weightConfig.IsFirstYearRule
                              || (app.Student.UniversityRecord?.Semester ?? simRec?.Semester ?? 1) == 1;

            decimal score;
            if (isFirstYear)
            {
                // CPN is sole criterion (scale 0–200 → normalize to 100)
                score = cpn * 0.5m;
            }
            else
            {
                // Weighted: CPN (0–200 normalized to 100) + CGPA (0–4 normalized to 100)
                var cpnNorm  = cpn * 0.5m;
                var cgpaNorm = (cgpa ?? 0m) * 25m; // 4.0 * 25 = 100
                score = (cpnNorm * weightConfig.CpnWeight) + (cgpaNorm * weightConfig.CgpaWeight);
            }

            scoredApplicants.Add((app, score, cpn, cgpa, isFirstYear));
        }

        // ── 6. Rank (descending score; ties by CPN, then CGPA, then ApplicationId) ──
        var ranked = scoredApplicants
            .OrderByDescending(x => x.Score)
            .ThenByDescending(x => x.Cpn)
            .ThenByDescending(x => x.Cgpa ?? 0m)
            .ThenBy(x => x.App.ApplicationId)
            .ToList();

        // ── 7. Upsert MeritResult records ──────────────────────────────────────
        int rank = 1;
        int eligible = 0, ineligible = 0;

        foreach (var (app, score, cpn, cgpa, isFirstYear) in ranked)
        {
            var cnic = app.Student.Cnic;
            simRecords.TryGetValue(cnic, out var simRec);

            // Determine eligibility (must have CPN data)
            var isEligible = cpn > 0;
            if (isEligible) eligible++; else ineligible++;

            // Check for existing MeritResult for this application
            var existing = await _context.MeritResults
                .FirstOrDefaultAsync(m => m.ApplicationId == app.ApplicationId);

            var firstPref = app.Preferences
                .OrderBy(p => p.PreferenceOrder)
                .FirstOrDefault()?.Hostel?.Name;

            if (existing != null)
            {
                // Update in place
                existing.CycleId          = cycle.CycleId;
                existing.Cpn              = cpn;
                existing.Cgpa             = cgpa;
                existing.MeritScore       = Math.Round(score, 4);
                existing.MeritRank        = isEligible ? rank : 9999;
                existing.IsEligible       = isEligible;
                existing.AllocationStatus = AllocationStatus.Pending;
                existing.Department       = app.Student.UniversityRecord?.Department?.Name ?? simRec?.DepartmentName;
                existing.Program          = app.Student.UniversityRecord?.Program?.Name ?? simRec?.ProgramName;
                existing.AcademicYear     = app.AcademicYear.Label;
                existing.District         = app.Student.District?.Name ?? simRec?.DistrictName;
                existing.Gender           = app.Student.Gender.ToString();
                existing.RollNumber       = app.Student.RegistrationNumber;
            }
            else
            {
                var meritResult = new MeritResult
                {
                    ApplicationId    = app.ApplicationId,
                    CycleId          = cycle.CycleId,
                    Cpn              = cpn,
                    Cgpa             = cgpa,
                    MeritScore       = Math.Round(score, 4),
                    MeritRank        = isEligible ? rank : 9999,
                    IsEligible       = isEligible,
                    AllocationStatus = AllocationStatus.Pending,
                    Department       = app.Student.UniversityRecord?.Department?.Name ?? simRec?.DepartmentName,
                    Program          = app.Student.UniversityRecord?.Program?.Name ?? simRec?.ProgramName,
                    AcademicYear     = app.AcademicYear.Label,
                    District         = app.Student.District?.Name ?? simRec?.DistrictName,
                    Gender           = app.Student.Gender.ToString(),
                    RollNumber       = app.Student.RegistrationNumber
                };
                _context.MeritResults.Add(meritResult);
            }

            // Update application status
            if (isEligible && app.Status != ApplicationStatus.MeritListed)
                app.Status = ApplicationStatus.MeritListed;

            if (isEligible) rank++;
        }

        // ── 8. Mark cycle completed ────────────────────────────────────────────
        cycle.Status  = "Completed";
        cycle.Remarks = $"Processed {freshApplicants.Count} applicants; {eligible} eligible, {ineligible} ineligible.";

        await _context.SaveChangesAsync();

        return new MeritRunResultDto
        {
            CycleId        = cycle.CycleId,
            TotalProcessed = freshApplicants.Count,
            Eligible       = eligible,
            Ineligible     = ineligible,
            RanAt          = cycle.RunAt,
            Message        = $"Merit run completed. {eligible} students ranked."
        };
    }

    // =========================================================================
    // GET /api/students/merit-result
    // =========================================================================
    public async Task<MeritResultDto> GetStudentMeritResultAsync(int userId)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .Include(s => s.District)
            .Include(s => s.UniversityRecord)
                .ThenInclude(ur => ur!.Department)
            .Include(s => s.UniversityRecord)
                .ThenInclude(ur => ur!.Program)
            .FirstOrDefaultAsync(s => s.UserId == userId)
            ?? throw new KeyNotFoundException("Student not found.");

        var app = await _context.Applications
            .Include(a => a.MeritResult)
            .Include(a => a.Preferences)
                .ThenInclude(p => p.Hostel)
            .Include(a => a.Allocations.Where(al => al.IsActive))
                .ThenInclude(al => al.Bed)
                    .ThenInclude(b => b.Room)
                        .ThenInclude(r => r.Floor)
                            .ThenInclude(f => f.Block)
                                .ThenInclude(bl => bl.Hostel)
            .OrderByDescending(a => a.AcademicYearId)
            .FirstOrDefaultAsync(a => a.StudentId == student.StudentId)
            ?? throw new KeyNotFoundException("No application found for this student.");

        // Total applicants in same cycle
        int totalApplicants = app.MeritResult?.CycleId != null
            ? await _context.MeritResults.CountAsync(m => m.CycleId == app.MeritResult.CycleId && m.IsEligible)
            : 0;

        var activeAllocation = app.Allocations.FirstOrDefault(a => a.IsActive);
        var hostel = activeAllocation?.Bed?.Room?.Floor?.Block?.Hostel;
        var room   = activeAllocation?.Bed?.Room;
        var bed    = activeAllocation?.Bed;

        // Final challan
        FinalChallanDto? finalChallan = null;
        if (activeAllocation != null)
        {
            var challan = await _context.Challans
                .Include(c => c.Fee)
                .Where(c => c.Fee.ApplicationId == app.ApplicationId && c.Fee.Amount == 15000m)
                .OrderByDescending(c => c.GeneratedAt)
                .FirstOrDefaultAsync();

            if (challan != null)
            {
                finalChallan = new FinalChallanDto
                {
                    ChallanId      = challan.ChallanId,
                    ChallanNumber  = challan.ChallanNumber,
                    Amount         = challan.Fee.Amount,
                    Status         = challan.Fee.Status.ToString(),
                    GeneratedAt    = challan.GeneratedAt,
                    ExpiresAt      = challan.ExpiresAt,
                    IsExpired      = challan.IsExpired,
                    AllocatedHostel = hostel?.Name,
                    AllocatedRoom   = room?.RoomNumber,
                    AllocatedBed    = bed?.BedLabel
                };
            }
        }

        var firstPref = app.Preferences
            .OrderBy(p => p.PreferenceOrder)
            .FirstOrDefault()?.Hostel?.Name;

        var mr = app.MeritResult;

        // If no merit result yet, return a minimal DTO
        if (mr == null)
        {
            return new MeritResultDto
            {
                ApplicationId   = app.ApplicationId,
                StudentName     = $"{student.User.FirstName} {student.User.LastName}",
                RollNumber      = student.RegistrationNumber,
                Department      = student.UniversityRecord?.Department?.Name ?? string.Empty,
                Program         = student.UniversityRecord?.Program?.Name ?? string.Empty,
                District        = student.District?.Name ?? string.Empty,
                Gender          = student.Gender.ToString(),
                AllocationStatus  = "Pending",
                ApplicationStatus = app.Status.ToString(),
                PreferredHostel   = firstPref,
                TotalApplicants   = 0
            };
        }

        return new MeritResultDto
        {
            MeritId         = mr.MeritId,
            ApplicationId   = app.ApplicationId,
            StudentName     = $"{student.User.FirstName} {student.User.LastName}",
            RollNumber      = mr.RollNumber ?? student.RegistrationNumber,
            Department      = mr.Department ?? student.UniversityRecord?.Department?.Name ?? string.Empty,
            Program         = mr.Program ?? student.UniversityRecord?.Program?.Name ?? string.Empty,
            AcademicYear    = mr.AcademicYear ?? string.Empty,
            Gender          = mr.Gender ?? student.Gender.ToString(),
            District        = mr.District ?? student.District?.Name ?? string.Empty,
            Cpn             = mr.Cpn,
            Cgpa            = mr.Cgpa,
            MeritScore      = mr.MeritScore,
            MeritRank       = mr.MeritRank,
            TotalApplicants = totalApplicants,
            IsEligible      = mr.IsEligible,
            AllocationStatus  = mr.AllocationStatus.ToString(),
            ApplicationStatus = app.Status.ToString(),
            PreferredHostel   = firstPref,
            AllocatedHostel   = mr.AllocatedHostel ?? hostel?.Name,
            AllocatedRoom     = mr.AllocatedRoom   ?? room?.RoomNumber,
            AllocatedBed      = mr.AllocatedBed    ?? bed?.BedLabel,
            FinalChallan      = finalChallan
        };
    }
}
