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
            var averageRating = h.Reviews.Any() ? h.Reviews.Average(r => r.OverallRating) : 4.3;
            var availableBeds = h.TotalCapacity; 

            var mainImg = h.Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl ?? h.Images.FirstOrDefault()?.ImageUrl;
            if (string.IsNullOrWhiteSpace(mainImg))
            {
                mainImg = h.Gender == Domain.Enums.Gender.Female 
                    ? "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80" 
                    : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80";
            }

            dtos.Add(new HostelSummaryDto
            {
                HostelId = h.HostelId,
                Name = h.Name,
                Gender = h.Gender.ToString(),
                Location = h.Address ?? "Main Campus, Jamshoro",
                MainImageUrl = mainImg,
                TotalCapacity = h.TotalCapacity,
                AvailableBeds = availableBeds,
                Rating = Math.Round(averageRating, 1),
                KeyAmenities = h.Amenities.Select(a => a.AmenityName).Take(5).ToList()
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

        var averageRating = hostel.Reviews.Any() ? hostel.Reviews.Average(r => r.OverallRating) : 4.3;
        bool isAllocationOpen = true; 

        var eligibilityList = hostel.EligibilityRules.Select(e => e.RuleName).ToList();
        if (!eligibilityList.Any() && !string.IsNullOrWhiteSpace(hostel.EligibilityRequirement))
        {
            eligibilityList.Add(hostel.EligibilityRequirement);
        }

        var images = hostel.Images.Select(i => i.ImageUrl).ToList();
        if (!images.Any())
        {
            images.Add(hostel.Gender == Domain.Enums.Gender.Female 
                ? "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80" 
                : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80");
        }

        return new HostelDetailDto
        {
            HostelId = hostel.HostelId,
            Name = hostel.Name,
            Gender = hostel.Gender.ToString(),
            Location = hostel.Address ?? "Main Campus, Jamshoro",
            Description = hostel.Description ?? "",
            Warden = hostel.Warden ?? "Prof. Dr. Provost Office",
            WardenPhone = hostel.WardenPhone ?? "+92 300 0000000",
            TotalCapacity = hostel.TotalCapacity,
            OccupiedBeds = 0,
            AvailableBeds = hostel.TotalCapacity,
            Rating = Math.Round(averageRating, 1),
            ReviewCount = hostel.Reviews.Count > 0 ? hostel.Reviews.Count : 12,
            IsAllocationOpen = isAllocationOpen,
            Images = images,
            Amenities = hostel.Amenities.Select(a => a.AmenityName).ToList(),
            EligibilitySummary = eligibilityList
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
