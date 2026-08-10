namespace SindhDormitory.Application.DTOs.Public;

public class HostelDetailDto
{
    public int HostelId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Description { get; set; }
    public string? Warden { get; set; }
    public string? WardenPhone { get; set; }
    public int TotalCapacity { get; set; }
    public int OccupiedBeds { get; set; }
    public int AvailableBeds { get; set; }
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsAllocationOpen { get; set; }

    public List<string> Images { get; set; } = new();
    public List<string> Amenities { get; set; } = new();
    public List<string> EligibilitySummary { get; set; } = new();
}
