using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SindhDormitory.Application.DTOs.Application;
using SindhDormitory.Application.DTOs.Residency;
using SindhDormitory.Application.Interfaces;

namespace SindhDormitory.API.Controllers;

[ApiController]
[Route("api/students/residency")]
[Authorize(Roles = "Student")]
public class StudentResidencyController : ControllerBase
{
    private readonly IResidencyService _residencyService;

    public StudentResidencyController(IResidencyService residencyService)
    {
        _residencyService = residencyService;
    }

    /// <summary>GET /api/students/residency — Returns whether the student is an existing resident or fresh applicant.</summary>
    [HttpGet]
    public async Task<IActionResult> GetResidencyStatus()
    {
        try
        {
            var userId = GetCurrentUserId();
            var residency = await _residencyService.GetStudentResidencyAsync(userId);
            return Ok(residency);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (Exception ex) { return StatusCode(500, new { message = ex.Message }); }
    }

    /// <summary>POST /api/students/residency/annual-challan — Generate annual resident fee challan.</summary>
    [HttpPost("annual-challan")]
    public async Task<IActionResult> GenerateAnnualChallan()
    {
        try
        {
            var userId = GetCurrentUserId();
            var challan = await _residencyService.GenerateAnnualFeeChallanAsync(userId);
            return Ok(challan);
        }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (Exception ex) { return StatusCode(500, new { message = ex.Message }); }
    }

    /// <summary>POST /api/students/residency/verify-annual-fee — Verify/confirm annual fee payment.</summary>
    [HttpPost("verify-annual-fee")]
    public async Task<IActionResult> VerifyAnnualFee([FromBody] VerifyPaymentRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var updatedResidency = await _residencyService.VerifyAnnualFeePaymentAsync(userId, request);
            return Ok(updatedResidency);
        }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (Exception ex) { return StatusCode(500, new { message = ex.Message }); }
    }

    private int GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? User.FindFirst("sub")?.Value
                    ?? User.FindFirst("userId")?.Value;

        if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out int userId))
            throw new UnauthorizedAccessException("User claim missing.");

        return userId;
    }
}
