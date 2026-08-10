// =============================================================================
// Domain/Entities/MeritResult.cs
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class MeritResult : BaseEntity
{
    public int     MeritId      { get; set; }
    public int     ApplicationId { get; set; }
    public decimal MeritScore   { get; set; }
    public int     MeritRank    { get; set; }
    public bool    IsFinalized  { get; set; } = false;
    public DateTime? FinalizedAt { get; set; }

    // Navigation
    public Application Application { get; set; } = null!;
}
