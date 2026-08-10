// =============================================================================
// Application/Services/AllocationService.cs
// =============================================================================
using Microsoft.EntityFrameworkCore;
using SindhDormitory.Application.DTOs.Merit;
using SindhDormitory.Application.Interfaces;
using SindhDormitory.Domain.Entities;
using SindhDormitory.Domain.Enums;
using ApplicationEntity = SindhDormitory.Domain.Entities.Application;

namespace SindhDormitory.Application.Services;

public class AllocationService : IAllocationService
{
    private readonly IApplicationDbContext _context;
    private const decimal FinalChallanAmount = 15_000m;
    private const int     ChallanExpiryDays  = 14;  // 2 weeks to pay final challan

    public AllocationService(IApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================================
    // POST /api/admin/allocation/run
    // =========================================================================
    public async Task<AllocationRunResultDto> RunAllocationAsync(int cycleId, int adminUserId)
    {
        // ── 1. Load and validate cycle ─────────────────────────────────────────
        var cycle = await _context.AllocationCycles
            .Include(c => c.AcademicYear)
            .FirstOrDefaultAsync(c => c.CycleId == cycleId)
            ?? throw new KeyNotFoundException($"AllocationCycle {cycleId} not found.");

        if (cycle.Status == "Completed")
            throw new InvalidOperationException(
                $"Cycle {cycleId} is already completed. Create a new merit run to generate a fresh cycle.");

        // ── 2. Load merit results for this cycle (eligible only, ranked) ───────
        var meritResults = await _context.MeritResults
            .Include(m => m.Application)
                .ThenInclude(a => a.Student)
                    .ThenInclude(s => s.Allocations.Where(al => al.IsActive))
            .Include(m => m.Application)
                .ThenInclude(a => a.Student)
                    .ThenInclude(s => s.District)
            .Include(m => m.Application)
                .ThenInclude(a => a.Preferences.OrderBy(p => p.PreferenceOrder))
                    .ThenInclude(p => p.Hostel)
                        .ThenInclude(h => h.Blocks)
                            .ThenInclude(b => b.Floors)
                                .ThenInclude(f => f.Rooms)
                                    .ThenInclude(r => r.Beds)
            .Where(m => m.CycleId == cycleId && m.IsEligible
                        && m.AllocationStatus == AllocationStatus.Pending)
            .OrderBy(m => m.MeritRank)
            .ToListAsync();

        // ── 3. Load district seat rules ────────────────────────────────────────
        var districtRules = await _context.DistrictSeatRules
            .Where(d => d.AcademicYearId == cycle.AcademicYearId && d.IsActive)
            .ToListAsync();

        // Track district allocations during this run
        var districtAllocCount = new Dictionary<int, int>();

        int totalAllocated = 0, totalWaitlisted = 0;

        // ── 4. Allocate each applicant in merit rank order ─────────────────────
        foreach (var merit in meritResults)
        {
            var app     = merit.Application;
            var student = app.Student;

            // SAFETY: Skip if student already has an active allocation (double-click guard)
            if (student.Allocations.Any(al => al.IsActive))
            {
                merit.AllocationStatus = AllocationStatus.Allocated;
                totalAllocated++;
                continue;
            }

            bool allocated = false;

            // Try each preferred hostel in order
            foreach (var pref in app.Preferences.OrderBy(p => p.PreferenceOrder))
            {
                var hostel = pref.Hostel;
                if (hostel == null) continue;

                // Gender check
                if (hostel.Gender != student.Gender) continue;

                // Find an available bed in this hostel
                var availableBed = hostel.Blocks
                    .SelectMany(b => b.Floors)
                    .SelectMany(f => f.Rooms)
                    .SelectMany(r => r.Beds)
                    .FirstOrDefault(b => b.IsAvailable && b.Status == BedStatus.Available);

                if (availableBed == null) continue;

                // District quota check (if rule exists)
                if (student.DistrictId.HasValue)
                {
                    var rule = districtRules.FirstOrDefault(d =>
                        d.DistrictId == student.DistrictId &&
                        (d.HostelId == null || d.HostelId == hostel.HostelId));

                    if (rule != null && rule.ReservedSeats > 0)
                    {
                        districtAllocCount.TryGetValue(student.DistrictId.Value, out int alreadyAlloc);
                        if (alreadyAlloc >= rule.ReservedSeats)
                            continue; // District quota exhausted for this hostel
                        districtAllocCount[student.DistrictId.Value] = alreadyAlloc + 1;
                    }
                }

                // ── Allocate! (use a DB transaction for the critical section) ──
                using var tx = await (_context as Microsoft.EntityFrameworkCore.DbContext)!
                    .Database.BeginTransactionAsync();
                try
                {
                    // Re-read bed availability inside transaction to prevent race conditions
                    var lockedBed = await _context.Beds
                        .FirstOrDefaultAsync(b => b.BedId == availableBed.BedId
                                                  && b.IsAvailable
                                                  && b.Status == BedStatus.Available);
                    if (lockedBed == null)
                    {
                        await tx.RollbackAsync();
                        continue; // Bed was taken between the read and the lock
                    }

                    // Mark bed unavailable
                    lockedBed.IsAvailable = false;
                    lockedBed.Status      = BedStatus.Occupied;

                    // Create allocation
                    var allocation = new Allocation
                    {
                        ApplicationId      = app.ApplicationId,
                        StudentId          = student.StudentId,
                        BedId              = lockedBed.BedId,
                        CycleId            = cycleId,
                        IsActive           = true,
                        AllocatedAt        = DateTime.UtcNow,
                        AllocatedByAdminId = adminUserId
                    };
                    _context.Allocations.Add(allocation);

                    // Update merit result
                    merit.AllocationStatus  = AllocationStatus.Allocated;
                    merit.AllocatedHostelId = hostel.HostelId;
                    merit.AllocatedHostel   = hostel.Name;
                    merit.AllocatedRoom     = availableBed.Room?.RoomNumber;
                    merit.AllocatedBed      = lockedBed.BedLabel;

                    // Update application status
                    app.Status = ApplicationStatus.RoomAllocated;

                    await _context.SaveChangesAsync();

                    // Generate final hostel fee challan
                    await GenerateFinalHostelChallanAsync(app, hostel, lockedBed);

                    // Notify student
                    await CreateNotificationAsync(
                        student.UserId,
                        "🎉 Room Allocated!",
                        $"Congratulations! You have been allocated {hostel.Name}, Room {availableBed.Room?.RoomNumber}, Bed {lockedBed.BedLabel}. " +
                        $"Please pay your final hostel fee of PKR {FinalChallanAmount:N0} within {ChallanExpiryDays} days.",
                        "/student/merit-result");

                    await tx.CommitAsync();
                    allocated = true;
                    totalAllocated++;
                    break;
                }
                catch
                {
                    await tx.RollbackAsync();
                    throw;
                }
            }

            if (!allocated)
            {
                merit.AllocationStatus = AllocationStatus.Waitlisted;
                app.Status             = ApplicationStatus.WaitingList;
                totalWaitlisted++;

                await CreateNotificationAsync(
                    student.UserId,
                    "📋 Waitlisted",
                    "Your application has been processed. Unfortunately, no seat was available in your preferred hostels. " +
                    "You have been placed on the waitlist. A second-round allocation will be conducted after the payment deadline.",
                    "/student/merit-result");
            }
        }

        // ── 5. Mark cycle completed ────────────────────────────────────────────
        cycle.Status  = "Completed";
        cycle.Remarks = $"First-round complete: {totalAllocated} allocated, {totalWaitlisted} waitlisted.";
        await _context.SaveChangesAsync();

        return new AllocationRunResultDto
        {
            CycleId         = cycleId,
            IsSecondRound   = false,
            TotalAllocated  = totalAllocated,
            TotalWaitlisted = totalWaitlisted,
            TotalRejected   = 0,
            RanAt           = DateTime.UtcNow,
            Message         = $"First-round allocation complete: {totalAllocated} allocated, {totalWaitlisted} waitlisted."
        };
    }

    // =========================================================================
    // POST /api/admin/allocation/second-round
    // =========================================================================
    public async Task<AllocationRunResultDto> RunSecondRoundAllocationAsync(int academicYearId, int adminUserId)
    {
        // ── 1. Identify unpaid/expired final challans ──────────────────────────
        var now      = DateTime.UtcNow;
        var expiredAllocations = await _context.Allocations
            .Include(al => al.Application)
                .ThenInclude(a => a.ProcessingFee)
                    .ThenInclude(f => f!.Challans)
            .Include(al => al.Bed)
            .Include(al => al.Application)
                .ThenInclude(a => a.MeritResult)
            .Where(al => al.IsActive
                         && al.Application.AcademicYearId == academicYearId
                         && al.Application.Status == ApplicationStatus.RoomAllocated)
            .ToListAsync();

        // Filter: final challan exists, is expired, and fee is unpaid
        // Final challan is identified as the one with Amount == FinalChallanAmount
        var toFree = new List<Allocation>();
        foreach (var al in expiredAllocations)
        {
            var finalChallan = await _context.Challans
                .Include(c => c.Fee)
                .Where(c => c.Fee.ApplicationId == al.ApplicationId
                            && c.Fee.Amount == FinalChallanAmount)
                .OrderByDescending(c => c.GeneratedAt)
                .FirstOrDefaultAsync();

            if (finalChallan != null
                && (finalChallan.IsExpired || finalChallan.ExpiresAt < now)
                && finalChallan.Fee.Status != FeeStatus.Paid)
            {
                toFree.Add(al);
            }
        }

        int freedSeats = toFree.Count;

        // ── 2. Free up those beds and deactivate allocations ───────────────────
        foreach (var al in toFree)
        {
            al.IsActive      = false;
            al.DeactivatedAt = now;

            var bed = al.Bed;
            if (bed != null)
            {
                bed.IsAvailable = true;
                bed.Status      = BedStatus.Available;
            }

            if (al.Application.MeritResult != null)
                al.Application.MeritResult.AllocationStatus = AllocationStatus.Rejected;

            al.Application.Status = ApplicationStatus.Rejected;

            await CreateNotificationAsync(
                al.Application.Student.UserId,
                "⚠️ Allocation Cancelled",
                "Your hostel room allocation has been cancelled due to non-payment of the final hostel fee by the deadline.",
                "/student/merit-result");
        }

        await _context.SaveChangesAsync();

        // ── 3. Create second-round AllocationCycle ─────────────────────────────
        var secondCycle = new AllocationCycle
        {
            AcademicYearId     = academicYearId,
            TriggeredByAdminId = adminUserId,
            RunAt              = DateTime.UtcNow,
            IsSecondRound      = true,
            Status             = "Running"
        };
        _context.AllocationCycles.Add(secondCycle);
        await _context.SaveChangesAsync();

        // ── 4. Fetch waitlisted merit results and re-rank ──────────────────────
        var waitlisted = await _context.MeritResults
            .Include(m => m.Application)
                .ThenInclude(a => a.Student)
                    .ThenInclude(s => s.Allocations)
            .Include(m => m.Application)
                .ThenInclude(a => a.Student)
                    .ThenInclude(s => s.District)
            .Include(m => m.Application)
                .ThenInclude(a => a.Preferences.OrderBy(p => p.PreferenceOrder))
                    .ThenInclude(p => p.Hostel)
                        .ThenInclude(h => h.Blocks)
                            .ThenInclude(b => b.Floors)
                                .ThenInclude(f => f.Rooms)
                                    .ThenInclude(r => r.Beds)
            .Where(m => m.Application.AcademicYearId == academicYearId
                        && m.AllocationStatus == AllocationStatus.Waitlisted
                        && m.IsEligible)
            .OrderBy(m => m.MeritRank)
            .ToListAsync();

        // Reset statuses for second round
        foreach (var m in waitlisted)
        {
            m.CycleId          = secondCycle.CycleId;
            m.AllocationStatus = AllocationStatus.Pending;
        }
        await _context.SaveChangesAsync();

        // ── 5. Run allocation for second-round cycle ───────────────────────────
        var result = await RunAllocationAsync(secondCycle.CycleId, adminUserId);

        return result with
        {
            IsSecondRound = true,
            FreedSeats    = freedSeats,
            Message       = $"Second-round complete: {freedSeats} seats freed. " +
                            $"{result.TotalAllocated} newly allocated, {result.TotalWaitlisted} still waitlisted."
        };
    }

    // =========================================================================
    // GET /api/admin/allocation/district-stats
    // =========================================================================
    public async Task<DistrictStatsDto> GetDistrictStatsAsync(int academicYearId)
    {
        var academicYear = await _context.AcademicYears
            .FirstOrDefaultAsync(y => y.AcademicYearId == academicYearId)
            ?? throw new KeyNotFoundException("Academic year not found.");

        var applications = await _context.Applications
            .Include(a => a.Student)
                .ThenInclude(s => s.District)
            .Include(a => a.MeritResult)
            .Where(a => a.AcademicYearId == academicYearId)
            .ToListAsync();

        var districtRules = await _context.DistrictSeatRules
            .Include(d => d.District)
            .Where(d => d.AcademicYearId == academicYearId && d.IsActive)
            .ToListAsync();

        var districtGroups = applications
            .Where(a => a.Student.DistrictId.HasValue)
            .GroupBy(a => a.Student.District!)
            .ToList();

        var stats = districtGroups.Select(g =>
        {
            var district  = g.Key;
            var reserved  = districtRules
                .Where(r => r.DistrictId == district.DistrictId)
                .Sum(r => r.ReservedSeats);
            var allocated = g.Count(a =>
                a.MeritResult?.AllocationStatus == AllocationStatus.Allocated);
            var waitlisted = g.Count(a =>
                a.MeritResult?.AllocationStatus == AllocationStatus.Waitlisted);

            return new DistrictStatDto
            {
                DistrictId      = district.DistrictId,
                DistrictName    = district.Name,
                TotalApplicants = g.Count(),
                ReservedSeats   = reserved,
                AllocatedSeats  = allocated,
                WaitlistedCount = waitlisted,
                RemainingSeats  = Math.Max(0, reserved - allocated)
            };
        }).OrderByDescending(s => s.TotalApplicants).ToList();

        return new DistrictStatsDto
        {
            AcademicYearId = academicYearId,
            AcademicYear   = academicYear.Label,
            Districts      = stats
        };
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private async Task GenerateFinalHostelChallanAsync(
        ApplicationEntity app, Hostel hostel, Bed bed)
    {
        // Check if a final challan already exists for this application
        var existingFee = await _context.ProcessingFees
            .Include(f => f.Challans)
            .Where(f => f.ApplicationId == app.ApplicationId && f.Amount == FinalChallanAmount)
            .FirstOrDefaultAsync();

        if (existingFee != null) return; // Already generated

        var challanNumber = $"FHCL-{DateTime.UtcNow.Year}-{app.ApplicationId:D5}";
        var expiresAt     = DateTime.UtcNow.AddDays(ChallanExpiryDays);

        var fee = new ProcessingFee
        {
            ApplicationId = app.ApplicationId,
            Amount        = FinalChallanAmount,
            Status        = FeeStatus.Pending,
            DueDate       = DateOnly.FromDateTime(expiresAt),
            Challans      =
            [
                new Challan
                {
                    ChallanNumber = challanNumber,
                    GeneratedAt   = DateTime.UtcNow,
                    ExpiresAt     = expiresAt,
                    IsExpired     = false
                }
            ]
        };

        _context.ProcessingFees.Add(fee);
        await _context.SaveChangesAsync();
    }

    private async Task CreateNotificationAsync(
        int userId, string title, string message, string? link = null)
    {
        _context.Notifications.Add(new Notification
        {
            UserId  = userId,
            Title   = title,
            Message = message,
            Link    = link,
            SentAt  = DateTime.UtcNow,
            IsRead  = false
        });
        await _context.SaveChangesAsync();
    }
}
