// =============================================================================
// Domain/Entities/District.cs
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class District : BaseEntity
{
    public int    DistrictId { get; set; }
    public string Name       { get; set; } = string.Empty;
    public string Province   { get; set; } = string.Empty;

    // Navigation
    public ICollection<Student> Students { get; set; } = [];
}
