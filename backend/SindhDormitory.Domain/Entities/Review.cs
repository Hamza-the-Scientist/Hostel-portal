// =============================================================================
// Domain/Entities/Review.cs + ReviewRating.cs
// Business rule: UNIQUE(ResidentId, HostelId) — one review per resident per hostel
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public class Review : BaseEntity
{
    public int     ReviewId      { get; set; }
    public int     ResidentId    { get; set; }
    public int     HostelId      { get; set; }
    public int     OverallRating { get; set; }  // 1–5
    public string? Comment       { get; set; }
    public bool    IsApproved    { get; set; } = false;
    public DateTime? ApprovedAt  { get; set; }

    // Navigation
    public Resident             Resident { get; set; } = null!;
    public Hostel               Hostel   { get; set; } = null!;
    public ICollection<ReviewRating> Ratings { get; set; } = [];
}

public class ReviewRating : BaseEntity
{
    public int    RatingId    { get; set; }
    public int    ReviewId    { get; set; }
    public string Category    { get; set; } = string.Empty;  // Cleanliness, Food, Security, etc.
    public int    Score       { get; set; }  // 1–5

    // Navigation
    public Review Review { get; set; } = null!;
}
