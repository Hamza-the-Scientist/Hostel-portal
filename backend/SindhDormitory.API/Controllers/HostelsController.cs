using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SindhDormitory.Application.Interfaces;

namespace SindhDormitory.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class HostelsController : ControllerBase
{
    private readonly IPublicService _publicService;
    private readonly IEligibilityService _eligibilityService;
    private readonly IApplicationDbContext _context;

    public HostelsController(IPublicService publicService, IEligibilityService eligibilityService, IApplicationDbContext context)
    {
        _publicService = publicService;
        _eligibilityService = eligibilityService;
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetHostels()
    {
        var hostels = await _publicService.GetHostelsAsync();
        return Ok(hostels);
    }

    [HttpGet("eligible")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetEligibleHostels()
    {
        var userId = GetCurrentUserId();
        var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
        if (student == null) return NotFound("Student profile not found.");

        var result = await _eligibilityService.GetEligibleHostelsForStudentAsync(student.StudentId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetHostelById(int id)
    {
        var hostel = await _publicService.GetHostelByIdAsync(id);
        if (hostel == null)
            return NotFound(new { message = "Hostel not found." });

        return Ok(hostel);
    }

    private int GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                    ?? User.FindFirst("sub")?.Value 
                    ?? User.FindFirst("userId")?.Value;

        return int.TryParse(claim, out int userId) ? userId : 0;
    }
}
