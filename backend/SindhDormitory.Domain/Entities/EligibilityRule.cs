// =============================================================================
// Domain/Entities/EligibilityRule.cs + EligibilityRuleValue.cs
// =============================================================================
namespace SindhDormitory.Domain.Entities;

/// <summary>
/// A named eligibility rule for a hostel, e.g. "Min CGPA 2.5", "Sindh Resident Only".
/// </summary>
public class EligibilityRule : BaseEntity
{
    public int    RuleId    { get; set; }
    public int    HostelId  { get; set; }
    public string RuleName  { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool   IsActive  { get; set; } = true;

    // Navigation
    public Hostel                        Hostel { get; set; } = null!;
    public ICollection<EligibilityRuleValue> Values { get; set; } = [];
}

/// <summary>
/// A single attribute check within an EligibilityRule.
/// Example: FieldName="Cgpa", Operator=">=", Value="2.5"
/// </summary>
public class EligibilityRuleValue : BaseEntity
{
    public int    ValueId   { get; set; }
    public int    RuleId    { get; set; }
    public string FieldName { get; set; } = string.Empty;  // e.g. Cgpa, DistrictId, Gender
    public string Operator  { get; set; } = string.Empty;  // >=, <=, ==, IN
    public string Value     { get; set; } = string.Empty;  // 2.5 / Sindh / Male

    // Navigation
    public EligibilityRule Rule { get; set; } = null!;
}
