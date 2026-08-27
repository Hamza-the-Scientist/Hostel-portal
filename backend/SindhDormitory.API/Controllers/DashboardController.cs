// src/Controllers/DashboardController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SindhDormitory.Domain.Enums;
using SindhDormitory.Infrastructure.Persistence;

namespace SindhDormitory.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public DashboardController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var totalStudents = await _dbContext.Students.CountAsync();
        var totalResidents = await _dbContext.Residents.CountAsync();
        var totalApplicants = await _dbContext.Applications.CountAsync();
        
        var totalBeds = await _dbContext.Beds.CountAsync();
        if (totalBeds == 0)
        {
            totalBeds = await _dbContext.Hostels.SumAsync(h => (int?)h.TotalCapacity) ?? 0;
        }

        var activeAllocations = await _dbContext.Allocations.CountAsync(a => a.IsActive);
        var availableSeats = Math.Max(0, totalBeds - activeAllocations);
        var pendingApplications = await _dbContext.Applications.CountAsync(a => a.Status != ApplicationStatus.AllocationComplete);
        var roomChangeRequests = await _dbContext.RoomChangeRequests.CountAsync();
        var openComplaints = await _dbContext.Complaints.CountAsync(c => c.Status == ComplaintStatus.Open);

        var stats = new
        {
            totalStudents = totalStudents,
            totalResidents = totalResidents,
            totalApplicants = totalApplicants,
            availableSeats = availableSeats,
            pendingApplications = pendingApplications,
            roomChangeRequests = roomChangeRequests,
            openComplaints = openComplaints,
            pendingPayments = 0
        };

        return Ok(stats);
    }

    [HttpGet("allocation/status")]
    public async Task<IActionResult> GetAllocationStatus()
    {
        var settings = await _dbContext.AdminSettings.FirstOrDefaultAsync();
        if (settings == null) return NotFound();
        return Ok(new
        {
            open = settings.AllocationOpen,
            deadline = settings.AllocationDeadline?.ToString("o")
        });
    }

    [HttpPut("allocation/status")]
    public async Task<IActionResult> SetAllocationStatus([FromBody] SetAllocationStatusRequest request)
    {
        var settings = await _dbContext.AdminSettings.FirstOrDefaultAsync();
        if (settings == null)
        {
            settings = new Domain.Entities.AdminSettings
            {
                AllocationOpen = request.Open,
                AllocationEnabled = request.Open,
                EffectiveFrom = DateTime.UtcNow
            };
            _dbContext.AdminSettings.Add(settings);
        }
        else
        {
            settings.AllocationOpen = request.Open;
            settings.AllocationEnabled = request.Open;
            settings.UpdatedAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
            open = settings.AllocationOpen,
            deadline = settings.AllocationDeadline?.ToString("o")
        });
    }
}

public class SetAllocationStatusRequest
{
    public bool Open { get; set; }
}

