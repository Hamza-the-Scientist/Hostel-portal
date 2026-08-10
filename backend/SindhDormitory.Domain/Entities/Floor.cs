// =============================================================================
// Domain/Entities/Floor.cs
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class Floor : BaseEntity
{
    public int FloorId     { get; set; }
    public int BlockId     { get; set; }
    public int FloorNumber { get; set; }

    // Navigation
    public Block            Block { get; set; } = null!;
    public ICollection<Room> Rooms { get; set; } = [];
}
