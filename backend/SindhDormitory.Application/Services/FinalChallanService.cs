// =============================================================================
// Application/Services/FinalChallanService.cs
// =============================================================================
using Microsoft.EntityFrameworkCore;
using SindhDormitory.Application.DTOs.Merit;
using SindhDormitory.Application.DTOs.Application;
using SindhDormitory.Application.Interfaces;
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Application.Services;

public class FinalChallanService : IFinalChallanService
{
    private readonly IApplicationDbContext _context;
    private const decimal FinalChallanAmount = 15_000m;

    public FinalChallanService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<FinalChallanDto?> GetFinalChallanAsync(int userId)
    {
        var challanList = await GetAllChallansAsync(userId);
        return challanList.FinalHostelChallan;
    }

    public async Task<ChallanListDto> GetAllChallansAsync(int userId)
    {
        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.UserId == userId)
            ?? throw new KeyNotFoundException("Student not found.");

        var app = await _context.Applications
            .Include(a => a.ProcessingFee)
                .ThenInclude(f => f!.Challans)
            .Include(a => a.Allocations.Where(al => al.IsActive))
                .ThenInclude(al => al.Bed)
                    .ThenInclude(b => b.Room)
                        .ThenInclude(r => r.Floor)
                            .ThenInclude(f => f.Block)
                                .ThenInclude(bl => bl.Hostel)
            .OrderByDescending(a => a.AcademicYearId)
            .FirstOrDefaultAsync(a => a.StudentId == student.StudentId);

        if (app == null)
            return new ChallanListDto();

        var result = new ChallanListDto();

        // ── Processing fee challan (PKR 100) ──────────────────────────────────
        var pfFees = await _context.ProcessingFees
            .Include(f => f.Challans)
            .Where(f => f.ApplicationId == app.ApplicationId && f.Amount != FinalChallanAmount)
            .ToListAsync();

        var pfFee     = pfFees.FirstOrDefault();
        var pfChallan = pfFee?.Challans.OrderByDescending(c => c.GeneratedAt).FirstOrDefault();

        if (pfChallan != null)
        {
            result.ProcessingFeeChallan = new FinalChallanDto
            {
                ChallanId     = pfChallan.ChallanId,
                ChallanNumber = pfChallan.ChallanNumber,
                Amount        = pfFee!.Amount,
                Status        = pfFee.Status.ToString(),
                GeneratedAt   = pfChallan.GeneratedAt,
                ExpiresAt     = pfChallan.ExpiresAt,
                IsExpired     = pfChallan.IsExpired
            };
        }

        // ── Final hostel challan (PKR 15,000) ─────────────────────────────────
        var finalFees = await _context.ProcessingFees
            .Include(f => f.Challans)
            .Where(f => f.ApplicationId == app.ApplicationId && f.Amount == FinalChallanAmount)
            .ToListAsync();

        var finalFee     = finalFees.FirstOrDefault();
        var finalChallan = finalFee?.Challans.OrderByDescending(c => c.GeneratedAt).FirstOrDefault();

        var activeAlloc = app.Allocations.FirstOrDefault(al => al.IsActive);
        var hostel = activeAlloc?.Bed?.Room?.Floor?.Block?.Hostel;
        var room   = activeAlloc?.Bed?.Room;
        var bed    = activeAlloc?.Bed;

        if (finalChallan != null)
        {
            result.FinalHostelChallan = new FinalChallanDto
            {
                ChallanId       = finalChallan.ChallanId,
                ChallanNumber   = finalChallan.ChallanNumber,
                Amount          = finalFee!.Amount,
                Status          = finalFee.Status.ToString(),
                GeneratedAt     = finalChallan.GeneratedAt,
                ExpiresAt       = finalChallan.ExpiresAt,
                IsExpired       = finalChallan.IsExpired,
                AllocatedHostel = hostel?.Name,
                AllocatedRoom   = room?.RoomNumber,
                AllocatedBed    = bed?.BedLabel
            };
        }

        return result;
    }
}
