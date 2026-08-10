using Microsoft.EntityFrameworkCore;
using SindhDormitory.Application.DTOs.Application;
using SindhDormitory.Application.Interfaces;
using SindhDormitory.Domain.Entities;
using SindhDormitory.Domain.Enums;
using ApplicationEntity = SindhDormitory.Domain.Entities.Application;

namespace SindhDormitory.Application.Services;

public class ApplicationService : IApplicationService
{
    private readonly IApplicationDbContext _context;
    private readonly IEligibilityService _eligibilityService;

    public ApplicationService(IApplicationDbContext context, IEligibilityService eligibilityService)
    {
        _context = context;
        _eligibilityService = eligibilityService;
    }

    public async Task<ApplicationDto> GetOrCreateActiveApplicationAsync(int userId)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
            throw new KeyNotFoundException("Student record not found for the user.");

        // Active Academic Year default ID = 1
        var activeYear = await _context.AcademicYears.FirstOrDefaultAsync();
        if (activeYear == null)
        {
            activeYear = new AcademicYear { Label = "2025-2026", StartDate = DateOnly.FromDateTime(DateTime.UtcNow), EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(1)), IsActive = true };
            _context.AcademicYears.Add(activeYear);
            await _context.SaveChangesAsync();
        }

        var app = await _context.Applications
            .Include(a => a.Preferences)
                .ThenInclude(p => p.Hostel)
            .Include(a => a.ProcessingFee)
                .ThenInclude(f => f!.Challans)
            .Include(a => a.Allocations)
            .FirstOrDefaultAsync(a => a.StudentId == student.StudentId && a.AcademicYearId == activeYear.AcademicYearId);

        if (app == null)
        {
            app = new ApplicationEntity
            {
                StudentId = student.StudentId,
                AcademicYearId = activeYear.AcademicYearId,
                Status = ApplicationStatus.Draft,
                CreatedAt = DateTime.UtcNow
            };

            _context.Applications.Add(app);
            await _context.SaveChangesAsync();
        }

        return MapToDto(app, student);
    }

    public async Task<ProcessingFeeChallanDto> GenerateProcessingFeeChallanAsync(int userId)
    {
        var appDto = await GetOrCreateActiveApplicationAsync(userId);
        var app = await _context.Applications
            .Include(a => a.ProcessingFee)
                .ThenInclude(f => f!.Challans)
            .FirstAsync(a => a.ApplicationId == appDto.ApplicationId);

        if (app.ProcessingFee != null)
        {
            var challan = app.ProcessingFee.Challans.FirstOrDefault();
            return new ProcessingFeeChallanDto
            {
                FeeId = app.ProcessingFee.FeeId,
                ChallanNumber = challan?.ChallanNumber ?? $"CHL-2026-{app.ApplicationId:D4}",
                Amount = app.ProcessingFee.Amount,
                Status = app.ProcessingFee.Status.ToString(),
                CreatedAt = app.ProcessingFee.CreatedAt,
                DueDate = app.ProcessingFee.DueDate.ToDateTime(TimeOnly.MinValue)
            };
        }

        var fee = new ProcessingFee
        {
            ApplicationId = app.ApplicationId,
            Amount = 100.00m, // Rule: Exactly 100 PKR single processing fee per application cycle
            Status = FeeStatus.Pending,
            DueDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7)),
            Challans = new List<Challan>
            {
                new Challan
                {
                    ChallanNumber = $"CHL-2026-{app.ApplicationId:D4}",
                    ExpiresAt = DateTime.UtcNow.AddDays(7)
                }
            }
        };

        _context.ProcessingFees.Add(fee);
        await _context.SaveChangesAsync();

        return new ProcessingFeeChallanDto
        {
            FeeId = fee.FeeId,
            ChallanNumber = fee.Challans.First().ChallanNumber,
            Amount = fee.Amount,
            Status = fee.Status.ToString(),
            CreatedAt = fee.CreatedAt,
            DueDate = fee.DueDate.ToDateTime(TimeOnly.MinValue)
        };
    }

    public async Task<ApplicationDto> VerifyProcessingFeeAsync(int userId, VerifyPaymentRequest request)
    {
        var appDto = await GetOrCreateActiveApplicationAsync(userId);
        var app = await _context.Applications
            .Include(a => a.ProcessingFee)
            .FirstAsync(a => a.ApplicationId == appDto.ApplicationId);

        if (app.ProcessingFee == null || app.ProcessingFee.FeeId != request.FeeId)
            throw new InvalidOperationException("Invalid processing fee record.");

        app.ProcessingFee.Status = FeeStatus.Paid;
        app.Status = ApplicationStatus.UnderReview; // Progress status

        await _context.SaveChangesAsync();
        return await GetOrCreateActiveApplicationAsync(userId);
    }

    public async Task<ApplicationDto> SubmitHostelPreferencesAsync(int userId, UpdatePreferencesRequest request)
    {
        var student = await _context.Students.FirstAsync(s => s.UserId == userId);
        var app = await _context.Applications
            .Include(a => a.Preferences)
            .Include(a => a.ProcessingFee)
            .FirstAsync(a => a.ApplicationId == request.ApplicationId && a.StudentId == student.StudentId);

        if (app.ProcessingFee == null || app.ProcessingFee.Status != FeeStatus.Paid)
        {
            throw new InvalidOperationException("Processing fee of PKR 100 must be paid before submitting hostel preferences.");
        }

        // Server-Side Eligibility Validation
        foreach (var pref in request.Preferences)
        {
            var isEligible = await _eligibilityService.IsStudentEligibleForHostelAsync(student.StudentId, pref.HostelId);
            if (!isEligible)
            {
                throw new InvalidOperationException($"You are not eligible for Hostel ID {pref.HostelId} due to gender or criteria mismatch.");
            }
        }

        _context.ApplicationHostelPreferences.RemoveRange(app.Preferences);

        foreach (var pref in request.Preferences)
        {
            _context.ApplicationHostelPreferences.Add(new ApplicationHostelPreference
            {
                ApplicationId = app.ApplicationId,
                HostelId = pref.HostelId,
                PreferenceOrder = pref.PriorityOrder
            });
        }

        await _context.SaveChangesAsync();
        return await GetOrCreateActiveApplicationAsync(userId);
    }

    public async Task<ApplicationDto> SubmitFinalApplicationAsync(int userId)
    {
        var appDto = await GetOrCreateActiveApplicationAsync(userId);
        var app = await _context.Applications
            .Include(a => a.Preferences)
            .Include(a => a.ProcessingFee)
            .FirstAsync(a => a.ApplicationId == appDto.ApplicationId);

        if (app.ProcessingFee == null || app.ProcessingFee.Status != FeeStatus.Paid)
            throw new InvalidOperationException("Processing fee must be paid prior to submission.");

        if (!app.Preferences.Any())
            throw new InvalidOperationException("You must select at least one hostel preference.");

        app.Status = ApplicationStatus.Submitted;
        app.SubmittedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return await GetOrCreateActiveApplicationAsync(userId);
    }

    private ApplicationDto MapToDto(ApplicationEntity app, Student student)
    {
        var (statusLabel, displayBadge) = MapStatusToDisplay(app.Status);
        var fee = app.ProcessingFee;
        var challan = fee?.Challans.FirstOrDefault();

        var isFeePaid = fee?.Status == FeeStatus.Paid;
        var hasPreferences = app.Preferences.Any();
        var isSubmitted = app.Status == ApplicationStatus.Submitted;
        var isAllocated = app.Allocations.Any(a => a.IsActive);

        var timeline = new List<ApplicationTimelineStepDto>
        {
            new ApplicationTimelineStepDto { StepName = "Registration", IsCompleted = true, IsCurrent = false, Description = "Student verified & registered" },
            new ApplicationTimelineStepDto { StepName = "Processing Fee Paid", IsCompleted = isFeePaid, IsCurrent = !isFeePaid, Description = isFeePaid ? "PKR 100 Verified" : "Pay PKR 100 Challan" },
            new ApplicationTimelineStepDto { StepName = "Hostel Preferences Submitted", IsCompleted = hasPreferences, IsCurrent = isFeePaid && !hasPreferences, Description = hasPreferences ? $"{app.Preferences.Count} Hostels Selected" : "Pending Selection" },
            new ApplicationTimelineStepDto { StepName = "Merit Processing", IsCompleted = isSubmitted, IsCurrent = isSubmitted && !isAllocated, Description = "Under Merit Review" },
            new ApplicationTimelineStepDto { StepName = "Room Allocated", IsCompleted = isAllocated, IsCurrent = false, Description = isAllocated ? "Room Assigned" : "Pending Allocation" },
            new ApplicationTimelineStepDto { StepName = "Final Challan", IsCompleted = false, IsCurrent = false, Description = "Hostel Allotment Fee" },
            new ApplicationTimelineStepDto { StepName = "Allocation Complete", IsCompleted = false, IsCurrent = false, Description = "Resident Card Issued" }
        };

        return new ApplicationDto
        {
            ApplicationId = app.ApplicationId,
            StudentId = student.StudentId,
            StudentName = $"{student.User.FirstName} {student.User.LastName}".Trim(),
            RollNumber = student.RegistrationNumber,
            Status = app.Status.ToString(),
            DisplayStatus = displayBadge,
            SubmittedAt = app.SubmittedAt,
            ProcessingFee = fee != null ? new ProcessingFeeChallanDto
            {
                FeeId = fee.FeeId,
                ChallanNumber = challan?.ChallanNumber ?? $"CHL-2026-{app.ApplicationId:D4}",
                Amount = fee.Amount,
                Status = fee.Status.ToString(),
                CreatedAt = fee.CreatedAt,
                DueDate = fee.DueDate.ToDateTime(TimeOnly.MinValue)
            } : null,
            Preferences = app.Preferences.Select(p => new EligibleHostelDto
            {
                HostelId = p.HostelId,
                Name = p.Hostel?.Name ?? $"Hostel #{p.HostelId}",
                Gender = p.Hostel?.Gender.ToString() ?? "CoEd",
                Location = "Jamshoro Campus",
                IsEligible = true,
                EligibilityReason = $"Priority #{p.PreferenceOrder}"
            }).ToList(),
            Timeline = timeline
        };
    }

    private (string label, string badge) MapStatusToDisplay(ApplicationStatus status)
    {
        return status switch
        {
            ApplicationStatus.Draft => ("Not Processed", "Not Processed"),
            ApplicationStatus.UnderReview => ("In Processing", "In Processing"),
            ApplicationStatus.Submitted => ("In Processing", "In Processing"),
            ApplicationStatus.Approved => ("Room Allocated", "Room Allocated"),
            ApplicationStatus.Rejected => ("Room Not Assigned", "Room Not Assigned"),
            _ => ("In Processing", "In Processing")
        };
    }
}
