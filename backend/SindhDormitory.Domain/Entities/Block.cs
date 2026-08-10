// =============================================================================
// Domain/Entities/Block.cs
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class Block : BaseEntity
{
    public int    BlockId   { get; set; }
    public int    HostelId  { get; set; }
    public string BlockName { get; set; } = string.Empty;

    // Navigation
    public Hostel            Hostel { get; set; } = null!;
    public ICollection<Floor> Floors { get; set; } = [];
}
