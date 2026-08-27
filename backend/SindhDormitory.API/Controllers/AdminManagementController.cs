using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SindhDormitory.Domain.Entities;
using SindhDormitory.Domain.Enums;
using SindhDormitory.Infrastructure.Persistence;

namespace SindhDormitory.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminManagementController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminManagementController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/admin/students
    /// Search and list students for Admin Student Management
    /// </summary>
    [HttpGet("students")]
    public async Task<IActionResult> GetStudents([FromQuery] string? name, [FromQuery] string? cnic, [FromQuery] string? rollNumber)
    {
        var list = await _context.Students
            .Include(s => s.User)
            .Include(s => s.District)
            .Include(s => s.UniversityRecord!)
                .ThenInclude(u => u.Department)
            .Include(s => s.UniversityRecord!)
                .ThenInclude(u => u.Program)
            .ToListAsync();

        if (!string.IsNullOrWhiteSpace(name))
        {
            var searchName = name.Trim().ToLower();
            list = list.Where(s => $"{s.User.FirstName} {s.User.LastName}".ToLower().Contains(searchName)).ToList();
        }

        if (!string.IsNullOrWhiteSpace(cnic))
        {
            var searchCnic = cnic.Trim();
            list = list.Where(s => s.Cnic.Contains(searchCnic)).ToList();
        }

        if (!string.IsNullOrWhiteSpace(rollNumber))
        {
            var searchRoll = rollNumber.Trim().ToLower();
            list = list.Where(s => s.RegistrationNumber.ToLower().Contains(searchRoll)).ToList();
        }

        var result = list.Select(s => new
        {
            studentId = s.StudentId,
            cnic = s.Cnic,
            rollNumber = s.RegistrationNumber,
            name = $"{s.User.FirstName} {s.User.LastName}".Trim(),
            department = s.UniversityRecord?.Department?.Name ?? "Computer Science",
            academicYear = s.UniversityRecord?.Semester != null ? $"Semester {s.UniversityRecord.Semester}" : "2025-2026",
            district = s.District?.Name ?? "Jamshoro",
            gender = s.Gender.ToString()
        });

        return Ok(result);
    }

    /// <summary>
    /// GET /api/admin/hostels
    /// </summary>
    [HttpGet("hostels")]
    public async Task<IActionResult> GetHostels()
    {
        var hostels = await _context.Hostels
            .Include(h => h.Blocks)
                .ThenInclude(b => b.Floors)
                    .ThenInclude(f => f.Rooms)
            .Include(h => h.Amenities)
            .Include(h => h.Images)
            .ToListAsync();

        var result = hostels.Select(h => new
        {
            hostelId = h.HostelId,
            name = h.Name,
            gender = h.Gender.ToString(),
            address = h.Address ?? "",
            description = h.Description ?? "",
            totalRooms = h.Blocks.SelectMany(b => b.Floors).SelectMany(f => f.Rooms).Count(),
            amenities = h.Amenities.Select(a => a.AmenityName).ToList(),
            images = h.Images.Select(i => i.ImageUrl).ToList(),
            isActive = h.IsActive
        });

        return Ok(result);
    }

    /// <summary>
    /// POST /api/admin/hostels
    /// </summary>
    [HttpPost("hostels")]
    public async Task<IActionResult> CreateHostel([FromBody] CreateHostelRequest request)
    {
        if (!Enum.TryParse<Gender>(request.Gender, true, out var gender))
        {
            gender = Gender.Male;
        }

        var hostel = new Hostel
        {
            Name = request.Name,
            Gender = gender,
            Address = request.Address,
            Description = request.Description,
            TotalCapacity = 100,
            IsActive = true
        };

        _context.Hostels.Add(hostel);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            hostelId = hostel.HostelId,
            name = hostel.Name,
            gender = hostel.Gender.ToString(),
            address = hostel.Address ?? "",
            description = hostel.Description ?? "",
            totalRooms = 0,
            isActive = hostel.IsActive
        });
    }

    /// <summary>
    /// PUT /api/admin/hostels/{id}
    /// </summary>
    [HttpPut("hostels/{id}")]
    public async Task<IActionResult> UpdateHostel(int id, [FromBody] CreateHostelRequest request)
    {
        var hostel = await _context.Hostels.FindAsync(id);
        if (hostel == null) return NotFound(new { message = "Hostel not found" });

        if (Enum.TryParse<Gender>(request.Gender, true, out var gender))
        {
            hostel.Gender = gender;
        }

        hostel.Name = request.Name;
        hostel.Address = request.Address;
        hostel.Description = request.Description;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            hostelId = hostel.HostelId,
            name = hostel.Name,
            gender = hostel.Gender.ToString(),
            address = hostel.Address ?? "",
            description = hostel.Description ?? "",
            isActive = hostel.IsActive
        });
    }

    /// <summary>
    /// DELETE /api/admin/hostels/{id}
    /// </summary>
    [HttpDelete("hostels/{id}")]
    public async Task<IActionResult> DeactivateHostel(int id)
    {
        var hostel = await _context.Hostels.FindAsync(id);
        if (hostel == null) return NotFound(new { message = "Hostel not found" });

        hostel.IsActive = false;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class CreateHostelRequest
{
    public string Name { get; set; } = string.Empty;
    public string Gender { get; set; } = "Male";
    public string? Address { get; set; }
    public string? Description { get; set; }
}
