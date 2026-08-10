using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SindhDormitory.Application.DTOs.Application;
using SindhDormitory.Application.Interfaces;

namespace SindhDormitory.API.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize(Roles = "Student")]
public class PaymentsController : ControllerBase
{
    private readonly IApplicationService _applicationService;
    private readonly IResidencyService _residencyService;

    public PaymentsController(IApplicationService applicationService, IResidencyService residencyService)
    {
        _applicationService = applicationService;
        _residencyService = residencyService;
    }

    // ── Fresh Applicant: Processing Fee ──────────────────────────────────────

    /// <summary>POST /api/payments/processing-fee — Generate processing fee challan for fresh applicant.</summary>
    [HttpPost("processing-fee")]
    public async Task<IActionResult> GenerateProcessingFee()
    {
        try
        {
            var userId = GetCurrentUserId();
            var challan = await _applicationService.GenerateProcessingFeeChallanAsync(userId);
            return Ok(challan);
        }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        catch (Exception ex) { return StatusCode(500, new { message = ex.Message }); }
    }

    /// <summary>POST /api/payments/verify — Verify processing fee payment for fresh applicant.</summary>
    [HttpPost("verify")]
    public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var updatedApp = await _applicationService.VerifyProcessingFeeAsync(userId, request);
            return Ok(updatedApp);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (Exception ex) { return StatusCode(500, new { message = ex.Message }); }
    }

    // ── Existing Resident: Annual Fee ─────────────────────────────────────────

    /// <summary>POST /api/payments/annual-challan — Generate annual resident fee challan (existing residents only).</summary>
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

    /// <summary>POST /api/payments/verify-annual-fee — Verify annual fee payment (existing residents only).</summary>
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
