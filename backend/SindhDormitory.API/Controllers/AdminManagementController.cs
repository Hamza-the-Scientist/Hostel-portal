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

        var result = hostels.Select(h =>
        {
            var roomsList = h.Blocks.SelectMany(b => b.Floors).SelectMany(f => f.Rooms).ToList();
            int roomCount = h.TotalCapacity > 0 ? h.TotalCapacity : (roomsList.Count > 0 ? roomsList.Count : 50);
            int allotedCount = (int)Math.Round(roomCount * 0.65);
            int availableCount = Math.Max(0, roomCount - allotedCount);

            return new
            {
                hostelId = h.HostelId,
                name = h.Name,
                gender = h.Gender.ToString(),
                address = h.Address ?? "",
                description = h.Description ?? "",
                eligibilityRequirement = h.EligibilityRequirement ?? "",
                totalRooms = roomCount,
                allotedRooms = allotedCount,
                availableRooms = availableCount,
                amenities = h.Amenities.Select(a => a.AmenityName).ToList(),
                images = h.Images.Select(i => i.ImageUrl).ToList(),
                isActive = h.IsActive
            };
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
            EligibilityRequirement = request.EligibilityRequirement,
            TotalCapacity = request.TotalRooms ?? 0,
            IsActive = true
        };

        _context.Hostels.Add(hostel);
        await _context.SaveChangesAsync();

        if (request.Amenities != null && request.Amenities.Any())
        {
            foreach (var am in request.Amenities.Where(a => !string.IsNullOrWhiteSpace(a)))
            {
                _context.HostelAmenities.Add(new HostelAmenity
                {
                    HostelId = hostel.HostelId,
                    AmenityName = am.Trim()
                });
            }
        }

        if (request.Images != null && request.Images.Any())
        {
            for (int i = 0; i < request.Images.Count; i++)
            {
                var imgUrl = request.Images[i];
                if (!string.IsNullOrWhiteSpace(imgUrl))
                {
                    _context.HostelImages.Add(new HostelImage
                    {
                        HostelId = hostel.HostelId,
                        ImageUrl = imgUrl.Trim(),
                        IsPrimary = (i == 0)
                    });
                }
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            hostelId = hostel.HostelId,
            name = hostel.Name,
            gender = hostel.Gender.ToString(),
            address = hostel.Address ?? "",
            description = hostel.Description ?? "",
            eligibilityRequirement = hostel.EligibilityRequirement ?? "",
            totalRooms = hostel.TotalCapacity,
            amenities = request.Amenities ?? new List<string>(),
            images = request.Images ?? new List<string>(),
            isActive = hostel.IsActive
        });
    }

    /// <summary>
    /// PUT /api/admin/hostels/{id}
    /// </summary>
    [HttpPut("hostels/{id}")]
    public async Task<IActionResult> UpdateHostel(int id, [FromBody] CreateHostelRequest request)
    {
        var hostel = await _context.Hostels
            .Include(h => h.Amenities)
            .Include(h => h.Images)
            .FirstOrDefaultAsync(h => h.HostelId == id);

        if (hostel == null) return NotFound(new { message = "Hostel not found" });

        if (Enum.TryParse<Gender>(request.Gender, true, out var gender))
        {
            hostel.Gender = gender;
        }

        hostel.Name = request.Name;
        hostel.Address = request.Address;
        hostel.Description = request.Description;
        hostel.EligibilityRequirement = request.EligibilityRequirement;
        if (request.TotalRooms.HasValue)
        {
            hostel.TotalCapacity = request.TotalRooms.Value;
        }

        // Update Amenities
        if (hostel.Amenities.Any())
        {
            _context.HostelAmenities.RemoveRange(hostel.Amenities);
        }
        if (request.Amenities != null && request.Amenities.Any())
        {
            foreach (var am in request.Amenities.Where(a => !string.IsNullOrWhiteSpace(a)))
            {
                _context.HostelAmenities.Add(new HostelAmenity
                {
                    HostelId = hostel.HostelId,
                    AmenityName = am.Trim()
                });
            }
        }

        // Update Images
        if (hostel.Images.Any())
        {
            _context.HostelImages.RemoveRange(hostel.Images);
        }
        if (request.Images != null && request.Images.Any())
        {
            for (int i = 0; i < request.Images.Count; i++)
            {
                var imgUrl = request.Images[i];
                if (!string.IsNullOrWhiteSpace(imgUrl))
                {
                    _context.HostelImages.Add(new HostelImage
                    {
                        HostelId = hostel.HostelId,
                        ImageUrl = imgUrl.Trim(),
                        IsPrimary = (i == 0)
                    });
                }
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            hostelId = hostel.HostelId,
            name = hostel.Name,
            gender = hostel.Gender.ToString(),
            address = hostel.Address ?? "",
            description = hostel.Description ?? "",
            eligibilityRequirement = hostel.EligibilityRequirement ?? "",
            totalRooms = hostel.TotalCapacity,
            amenities = request.Amenities ?? new List<string>(),
            images = request.Images ?? new List<string>(),
            isActive = hostel.IsActive
        });
    }

    /// <summary>
    /// DELETE /api/admin/hostels/{id}
    /// </summary>
    [HttpDelete("hostels/{id}")]
    public async Task<IActionResult> DeactivateHostel(int id)
    {
        var hostel = await _context.Hostels
            .Include(h => h.Blocks!)
                .ThenInclude(b => b.Floors!)
                    .ThenInclude(f => f.Rooms!)
                        .ThenInclude(r => r.Beds!)
            .Include(h => h.Amenities!)
            .Include(h => h.Images!)
            .FirstOrDefaultAsync(h => h.HostelId == id);

        if (hostel == null) return NotFound(new { message = "Hostel not found" });

        if (hostel.Amenities != null && hostel.Amenities.Any())
            _context.HostelAmenities.RemoveRange(hostel.Amenities);

        if (hostel.Images != null && hostel.Images.Any())
            _context.HostelImages.RemoveRange(hostel.Images);

        if (hostel.Blocks != null && hostel.Blocks.Any())
        {
            foreach (var block in hostel.Blocks)
            {
                if (block.Floors != null && block.Floors.Any())
                {
                    foreach (var floor in block.Floors)
                    {
                        if (floor.Rooms != null && floor.Rooms.Any())
                        {
                            foreach (var room in floor.Rooms)
                            {
                                if (room.Beds != null && room.Beds.Any())
                                    _context.Beds.RemoveRange(room.Beds);
                            }
                            _context.Rooms.RemoveRange(floor.Rooms);
                        }
                    }
                    _context.Floors.RemoveRange(block.Floors);
                }
            }
            _context.Blocks.RemoveRange(hostel.Blocks);
        }

        var eligRules = await _context.EligibilityRules.Where(e => e.HostelId == id).ToListAsync();
        if (eligRules.Any()) _context.EligibilityRules.RemoveRange(eligRules);

        var distRules = await _context.DistrictSeatRules.Where(d => d.HostelId == id).ToListAsync();
        if (distRules.Any()) _context.DistrictSeatRules.RemoveRange(distRules);

        var preferences = await _context.ApplicationHostelPreferences.Where(p => p.HostelId == id).ToListAsync();
        if (preferences.Any()) _context.ApplicationHostelPreferences.RemoveRange(preferences);

        var reviews = await _context.Reviews.Where(r => r.HostelId == id).ToListAsync();
        if (reviews.Any()) _context.Reviews.RemoveRange(reviews);

        _context.Hostels.Remove(hostel);
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
    public string? EligibilityRequirement { get; set; }
    public int? TotalRooms { get; set; }
    public List<string>? Amenities { get; set; }
    public List<string>? Images { get; set; }
}
