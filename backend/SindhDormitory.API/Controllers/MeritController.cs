// =============================================================================
// API/Controllers/MeritController.cs
// POST /api/admin/merit/run
// =============================================================================
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SindhDormitory.Application.DTOs.Merit;
using SindhDormitory.Application.Interfaces;

namespace SindhDormitory.API.Controllers;

[ApiController]
[Route("api/admin/merit")]
[Authorize(Roles = "Admin")]
public class MeritController : ControllerBase
{
    private readonly IMeritService _meritService;

    public MeritController(IMeritService meritService)
    {
        _meritService = meritService;
    }

    /// <summary>
    /// POST /api/admin/merit/run
    /// Computes and stores MeritResults for all eligible fresh applicants.
    /// Creates a new AllocationCycle. Safe to call multiple times (idempotent per cycle).
    /// </summary>
    [HttpPost("run")]
    public async Task<IActionResult> RunMerit([FromBody] RunMeritRequest request)
    {
        try
        {
            var adminUserId = GetAdminUserId();
            var result      = await _meritService.RunMeritAsync(request.AcademicYearId, adminUserId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
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
