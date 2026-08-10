using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class Bed : SoftDeletableEntity
{
    public int       BedId       { get; set; }
    public int       RoomId      { get; set; }
    public string    BedLabel    { get; set; } = string.Empty;
    public bool      IsAvailable { get; set; } = true;
    public BedStatus Status      { get; set; } = BedStatus.Available;

    // Navigation
    public Room                     Room        { get; set; } = null!;
    public ICollection<Allocation> Allocations { get; set; } = [];
}
