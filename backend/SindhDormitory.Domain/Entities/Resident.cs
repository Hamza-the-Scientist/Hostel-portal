// =============================================================================
// Domain/Entities/Resident.cs
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class Resident : BaseEntity
{
    public int       ResidentId        { get; set; }
    public int       AllocationId      { get; set; }
    public DateOnly  CheckInDate       { get; set; }
    public DateOnly? CheckOutDate      { get; set; }
    public bool      IsCurrentResident { get; set; } = true;
    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public bool      IsActive          => IsCurrentResident;

    // Navigation
    public Allocation                       Allocation           { get; set; } = null!;
    public ICollection<Complaint>           Complaints           { get; set; } = [];
    public ICollection<RoomChangeRequest>   RoomChangeRequests   { get; set; } = [];
    public ICollection<Review>              Reviews              { get; set; } = [];
}
