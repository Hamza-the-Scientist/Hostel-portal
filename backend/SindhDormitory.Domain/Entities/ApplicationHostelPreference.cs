// =============================================================================
// Domain/Entities/ApplicationHostelPreference.cs
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class ApplicationHostelPreference : BaseEntity
{
    public int PrefId          { get; set; }
    public int ApplicationId   { get; set; }
    public int HostelId        { get; set; }
    public int PreferenceOrder { get; set; }  // 1 = first choice

    // Navigation
    public Application Application { get; set; } = null!;
    public Hostel      Hostel      { get; set; } = null!;
}
