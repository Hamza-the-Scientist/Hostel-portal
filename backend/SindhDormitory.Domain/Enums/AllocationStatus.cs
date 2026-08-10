// =============================================================================
// Domain/Enums/AllocationStatus.cs
// =============================================================================
namespace SindhDormitory.Domain.Enums;

public enum AllocationStatus
{
    Pending    = 0,  // Merit computed, not yet allocated
    Allocated  = 1,  // Room/bed assigned
    Waitlisted = 2,  // No seat available in any preferred hostel
    Rejected   = 3   // Ineligible or final challan expired unpaid
}
