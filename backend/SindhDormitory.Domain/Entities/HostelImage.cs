// =============================================================================
// Domain/Entities/HostelImage.cs
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class HostelImage : BaseEntity
{
    public int    ImageId    { get; set; }
    public int    HostelId   { get; set; }
    public string ImageUrl   { get; set; } = string.Empty;
    public bool   IsPrimary  { get; set; } = false;
    public string? Caption   { get; set; }

    // Navigation
    public Hostel Hostel { get; set; } = null!;
}
