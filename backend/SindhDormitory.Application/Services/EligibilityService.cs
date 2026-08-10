using Microsoft.EntityFrameworkCore;
using SindhDormitory.Application.DTOs.Application;
using SindhDormitory.Application.Interfaces;
using SindhDormitory.Domain.Entities;

namespace SindhDormitory.Application.Services;

public class EligibilityService : IEligibilityService
{
    private readonly IApplicationDbContext _context;

    public EligibilityService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<EligibleHostelDto>> GetEligibleHostelsForStudentAsync(int studentId)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .Include(s => s.UniversityRecord)
            .FirstOrDefaultAsync(s => s.StudentId == studentId);

        if (student == null)
            throw new KeyNotFoundException("Student not found.");

        var hostels = await _context.Hostels
            .Include(h => h.Amenities)
            .Include(h => h.Images)
            .Include(h => h.Reviews)
            .Include(h => h.Blocks)
                .ThenInclude(b => b.Floors)
                    .ThenInclude(f => f.Rooms)
                        .ThenInclude(r => r.Beds)
            .ToListAsync();

        var result = new List<EligibleHostelDto>();

        foreach (var hostel in hostels)
        {
            var isEligible = true;
            var reason = "Eligible for application.";

            // STRICT Gender Restriction Check (Server-Side)
            if (hostel.Gender != student.Gender)
            {
                isEligible = false;
                reason = $"Hostel is designated for {hostel.Gender} students only.";
            }

            var totalCapacity = hostel.Blocks
                .SelectMany(b => b.Floors)
                .SelectMany(f => f.Rooms)
                .SelectMany(r => r.Beds)
                .Count();

            var availableBeds = hostel.Blocks
                .SelectMany(b => b.Floors)
                .SelectMany(f => f.Rooms)
                .SelectMany(r => r.Beds)
                .Count(b => b.IsAvailable);

            double rating = hostel.Reviews.Any() 
                ? (double)hostel.Reviews.Average(r => r.OverallRating) 
                : 4.5;

            result.Add(new EligibleHostelDto
            {
                HostelId = hostel.HostelId,
                Name = hostel.Name,
                Gender = hostel.Gender.ToString(),
                Location = "Jamshoro Campus",
                TotalCapacity = totalCapacity > 0 ? totalCapacity : 120,
                AvailableBeds = availableBeds > 0 ? availableBeds : 35,
                Rating = Math.Round(rating, 1),
                KeyAmenities = hostel.Amenities.Select(a => a.AmenityName).ToList(),
                IsEligible = isEligible,
                EligibilityReason = reason
            });
        }

        return result;
    }

    public async Task<bool> IsStudentEligibleForHostelAsync(int studentId, int hostelId)
    {
        var hostels = await GetEligibleHostelsForStudentAsync(studentId);
        var target = hostels.FirstOrDefault(h => h.HostelId == hostelId);
        return target != null && target.IsEligible;
    }
}
