// =============================================================================
// Domain/Entities/Room.cs
// =============================================================================
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class Room : SoftDeletableEntity
{
    public int      RoomId        { get; set; }
    public int      FloorId       { get; set; }
    public string   RoomNumber    { get; set; } = string.Empty;
    public RoomType RoomType      { get; set; }
    public int      MaxOccupancy  { get; set; }
    public string?  Description   { get; set; }
    public bool     IsUnderMaintenance { get; set; } = false;

    // Navigation
    public Floor          Floor { get; set; } = null!;
    public ICollection<Bed> Beds  { get; set; } = [];
}
