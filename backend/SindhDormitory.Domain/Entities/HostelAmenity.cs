// =============================================================================
// Domain/Entities/HostelAmenity.cs
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class HostelAmenity : BaseEntity
{
    public int     AmenityId    { get; set; }
    public int     HostelId     { get; set; }
    public string  AmenityName  { get; set; } = string.Empty;
    public string? Description  { get; set; }

    // Navigation
    public Hostel Hostel { get; set; } = null!;
}
