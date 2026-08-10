// =============================================================================
// Domain/Enums/RequestStatus.cs  — Used by RoomChangeRequests
// =============================================================================
namespace SindhDormitory.Domain.Enums;

public enum RequestStatus
{
    Pending  = 0,
    Approved = 1,
    Rejected = 2,
    Cancelled = 3,
    UnderReview = 4
}
