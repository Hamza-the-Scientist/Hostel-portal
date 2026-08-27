// =============================================================================
// Domain/Entities/Hostel.cs
// =============================================================================
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class Hostel : SoftDeletableEntity
{
    public int     HostelId      { get; set; }
    public string  Name          { get; set; } = string.Empty;
    public Gender  Gender        { get; set; }
    public int     TotalCapacity { get; set; }
    public string? Address       { get; set; }
    public string? Description   { get; set; }
    public string? EligibilityRequirement { get; set; }
    public string? Warden        { get; set; }
    public string? WardenPhone   { get; set; }
    public bool    IsActive      { get; set; } = true;

    // Navigation
    public ICollection<HostelAmenity>      Amenities        { get; set; } = [];
    public ICollection<HostelImage>        Images           { get; set; } = [];
    public ICollection<EligibilityRule>    EligibilityRules { get; set; } = [];
    public ICollection<Block>              Blocks           { get; set; } = [];
    public ICollection<Review>             Reviews          { get; set; } = [];
    public ICollection<ApplicationHostelPreference> Preferences { get; set; } = [];
}
