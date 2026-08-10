// =============================================================================
// Domain/Enums/ApplicationStatus.cs
// =============================================================================
namespace SindhDormitory.Domain.Enums;

public enum ApplicationStatus
{
    Draft        = 0,
    Submitted    = 1,
    UnderReview  = 2,
    MeritListed  = 3,
    Approved     = 4,
    Rejected     = 5,
    Withdrawn    = 6,
    WaitingList  = 7
}
