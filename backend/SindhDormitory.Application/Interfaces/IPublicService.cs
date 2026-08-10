using SindhDormitory.Application.DTOs.Public;

namespace SindhDormitory.Application.Interfaces;

public interface IPublicService
{
    Task<List<HostelSummaryDto>> GetHostelsAsync();
    Task<HostelDetailDto?> GetHostelByIdAsync(int id);
    Task<List<AnnouncementDto>> GetAnnouncementsAsync();
}
