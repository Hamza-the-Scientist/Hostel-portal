using Microsoft.EntityFrameworkCore;
using SindhDormitory.Application.DTOs.Public;
using SindhDormitory.Application.Interfaces;

namespace SindhDormitory.Application.Services;

public class PublicService : IPublicService
{
    private readonly IApplicationDbContext _context;

    public PublicService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<HostelSummaryDto>> GetHostelsAsync()
    {
        var hostels = await _context.Hostels
            .Include(h => h.Images)
            .Include(h => h.Amenities)
            .Include(h => h.Reviews)
            .Where(h => h.IsActive)
            .ToListAsync();

        var dtos = new List<HostelSummaryDto>();
        foreach (var h in hostels)
        {
            var averageRating = h.Reviews.Any() ? h.Reviews.Average(r => r.OverallRating) : 0;
            
            // For simplicity in Phase 3, we calculate available beds generically if active allocations aren't seeded yet.
            // In a real scenario, this would query Allocations based on Beds.
            var availableBeds = h.TotalCapacity; 

            dtos.Add(new HostelSummaryDto
            {
                HostelId = h.HostelId,
                Name = h.Name,
                Gender = h.Gender.ToString(),
                Location = h.Address,
                MainImageUrl = h.Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl ?? h.Images.FirstOrDefault()?.ImageUrl,
                TotalCapacity = h.TotalCapacity,
                AvailableBeds = availableBeds,
                Rating = averageRating,
                KeyAmenities = h.Amenities.Select(a => a.AmenityName).Take(3).ToList()
            });
        }

        return dtos;
    }

    public async Task<HostelDetailDto?> GetHostelByIdAsync(int id)
    {
        var hostel = await _context.Hostels
            .Include(h => h.Images)
            .Include(h => h.Amenities)
            .Include(h => h.Reviews)
            .Include(h => h.EligibilityRules)
            .FirstOrDefaultAsync(h => h.HostelId == id && h.IsActive);

        if (hostel == null) return null;

        var averageRating = hostel.Reviews.Any() ? hostel.Reviews.Average(r => r.OverallRating) : 0;
        
        // Simulating global allocation switch: hardcoded to true for demo (can be driven by DB config later)
        bool isAllocationOpen = true; 

        return new HostelDetailDto
        {
            HostelId = hostel.HostelId,
            Name = hostel.Name,
            Gender = hostel.Gender.ToString(),
            Location = hostel.Address,
            Description = hostel.Description,
            Warden = hostel.Warden,
            WardenPhone = hostel.WardenPhone,
            TotalCapacity = hostel.TotalCapacity,
            OccupiedBeds = 0, // Placeholder
            AvailableBeds = hostel.TotalCapacity,
            Rating = averageRating,
            ReviewCount = hostel.Reviews.Count,
            IsAllocationOpen = isAllocationOpen,
            Images = hostel.Images.Select(i => i.ImageUrl).ToList(),
            Amenities = hostel.Amenities.Select(a => a.AmenityName).ToList(),
            EligibilitySummary = hostel.EligibilityRules.Select(e => e.RuleName).ToList()
        };
    }

    public async Task<List<AnnouncementDto>> GetAnnouncementsAsync()
    {
        return await _context.Announcements
            .Where(a => a.IsPublished && (a.ExpiresAt == null || a.ExpiresAt > DateTime.UtcNow))
            .OrderByDescending(a => a.PublishedAt)
            .Select(a => new AnnouncementDto
            {
                AnnouncementId = a.AnnouncementId,
                Title = a.Title,
                Content = a.Content,
                PublishedAt = a.PublishedAt
            })
            .ToListAsync();
    }
}
