namespace SindhDormitory.Application.DTOs.Public;

public class HostelSummaryDto
{
    public int HostelId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? MainImageUrl { get; set; }
    public int TotalCapacity { get; set; }
    public int AvailableBeds { get; set; }
    public double Rating { get; set; }
    public List<string> KeyAmenities { get; set; } = new();
}
