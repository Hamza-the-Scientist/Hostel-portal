using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class RoomChangeRequest : BaseEntity
{
    public int           RequestId         { get; set; }
    public int           ResidentId        { get; set; }
    public int?          RequestedRoomId   { get; set; }
    public string?       PreferredBlock    { get; set; }
    public string        Reason            { get; set; } = string.Empty;
    public string?       AdditionalDetails { get; set; }
    public string?       AttachmentUrl     { get; set; }
    public RequestStatus Status            { get; set; } = RequestStatus.Pending;
    public int?          ReviewedByAdminId { get; set; }
    public string?       AdminRemarks      { get; set; }
    public DateTime?     ReviewedAt        { get; set; }

    // Navigation
    public Resident  Resident      { get; set; } = null!;
    public Room?     RequestedRoom { get; set; }
}
