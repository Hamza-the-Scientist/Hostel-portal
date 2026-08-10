using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SindhDormitory.Application.DTOs.Profile;
using SindhDormitory.Application.Interfaces;

namespace SindhDormitory.API.Controllers;

[ApiController]
[Route("api/students")]
[Authorize(Roles = "Student")]
public class StudentsController : ControllerBase
{
    private readonly IStudentProfileService _profileService;

    public StudentsController(IStudentProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetCurrentUserId();
        var profile = await _profileService.GetProfileByUserIdAsync(userId);
        return Ok(profile);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateStudentProfileRequest request)
    {
        var userId = GetCurrentUserId();
        var updatedProfile = await _profileService.UpdateProfileByUserIdAsync(userId, request);
        return Ok(updatedProfile);
    }

    private int GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                    ?? User.FindFirst("sub")?.Value 
                    ?? User.FindFirst("userId")?.Value;

        if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out int userId))
        {
            throw new UnauthorizedAccessException("User identification claim missing in token.");
        }

        return userId;
    }
}
