// =============================================================================
// API/Controllers/AllocationController.cs
// POST /api/admin/allocation/run
// POST /api/admin/allocation/second-round
// GET  /api/admin/allocation/district-stats
// =============================================================================
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SindhDormitory.Application.DTOs.Merit;
using SindhDormitory.Application.Interfaces;

namespace SindhDormitory.API.Controllers;

[ApiController]
[Route("api/admin/allocation")]
[Authorize(Roles = "Admin")]
public class AllocationController : ControllerBase
{
    private readonly IAllocationService _allocationService;

    public AllocationController(IAllocationService allocationService)
    {
        _allocationService = allocationService;
    }

    /// <summary>
    /// POST /api/admin/allocation/run
    /// Runs the first-round allocation for the given AllocationCycle.
    /// Idempotent — double-clicking does NOT create duplicate allocations.
    /// Requires: cycleId returned by POST /api/admin/merit/run.
    /// </summary>
    [HttpPost("run")]
    public async Task<IActionResult> RunAllocation([FromBody] RunAllocationRequest request)
    {
        try
        {
            var adminUserId = GetAdminUserId();
            var result      = await _allocationService.RunAllocationAsync(request.CycleId, adminUserId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        catch (Exception ex) { return StatusCode(500, new { message = ex.Message }); }
    }

    /// <summary>
    /// POST /api/admin/allocation/second-round
    /// Frees unpaid final challans, then runs allocation for waitlisted students.
    /// </summary>
    [HttpPost("second-round")]
    public async Task<IActionResult> RunSecondRound([FromBody] RunSecondRoundRequest request)
    {
        try
        {
            var adminUserId = GetAdminUserId();
            var result      = await _allocationService.RunSecondRoundAllocationAsync(request.AcademicYearId, adminUserId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        catch (Exception ex) { return StatusCode(500, new { message = ex.Message }); }
    }

    /// <summary>
    /// GET /api/admin/allocation/district-stats?academicYearId={id}
    /// Returns district-wise applicant, allocated, and waitlisted counts.
    /// </summary>
    [HttpGet("district-stats")]
    public async Task<IActionResult> GetDistrictStats([FromQuery] int academicYearId)
    {
        try
        {
            var stats = await _allocationService.GetDistrictStatsAsync(academicYearId);
            return Ok(stats);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (Exception ex) { return StatusCode(500, new { message = ex.Message }); }
    }

    private int GetAdminUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                    ?? User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out int id))
            throw new UnauthorizedAccessException("Admin claim missing.");
        return id;
    }
}
