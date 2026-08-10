// =============================================================================
// Domain/Entities/ProcessingFee.cs + Challan.cs + Payment.cs
// Business rule: UNIQUE(ApplicationId) on ProcessingFees
// =============================================================================
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class ProcessingFee : BaseEntity
{
    public int       FeeId         { get; set; }
    public int       ApplicationId { get; set; }   // UNIQUE — one fee per application
    public decimal   Amount        { get; set; }
    public DateOnly  DueDate       { get; set; }
    public FeeStatus Status        { get; set; } = FeeStatus.Pending;

    // Navigation
    public Application           Application { get; set; } = null!;
    public ICollection<Challan>  Challans    { get; set; } = [];
}

public class Challan : BaseEntity
{
    public int      ChallanId     { get; set; }
    public int      FeeId         { get; set; }
    public string   ChallanNumber { get; set; } = string.Empty;  // UNIQUE
    public DateTime GeneratedAt   { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt     { get; set; }
    public bool     IsExpired     { get; set; } = false;

    // Navigation
    public ProcessingFee       Fee      { get; set; } = null!;
    public ICollection<Payment> Payments { get; set; } = [];
}

public class Payment : BaseEntity
{
    public int      PaymentId      { get; set; }
    public int      ChallanId      { get; set; }
    public decimal  Amount         { get; set; }
    public DateTime PaidAt         { get; set; }
    public string   TransactionRef { get; set; } = string.Empty;  // UNIQUE
    public string?  PaymentMethod  { get; set; }  // Cash, Online, HBL, etc.
    public int?     VerifiedByAdminId { get; set; }
    public DateTime? VerifiedAt    { get; set; }

    // Navigation
    public Challan Challan { get; set; } = null!;
}
