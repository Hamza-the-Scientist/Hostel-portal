using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SindhDormitory.Application.DTOs.Application;
using SindhDormitory.Application.Interfaces;

namespace SindhDormitory.API.Controllers;

[ApiController]
[Route("api/students/application")]
[Authorize(Roles = "Student")]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public ApplicationsController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetApplication()
    {
        var userId = GetCurrentUserId();
        var app = await _applicationService.GetOrCreateActiveApplicationAsync(userId);
        return Ok(app);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrSubmitApplication()
    {
        var userId = GetCurrentUserId();
        var app = await _applicationService.SubmitFinalApplicationAsync(userId);
        return Ok(app);
    }

    [HttpPut("/api/applications/preferences")]
    public async Task<IActionResult> UpdatePreferences([FromBody] UpdatePreferencesRequest request)
    {
        var userId = GetCurrentUserId();
        var app = await _applicationService.SubmitHostelPreferencesAsync(userId, request);
        return Ok(app);
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
