// =============================================================================
// Domain/Entities/BaseEntity.cs — Shared audit columns for all entities
// =============================================================================
namespace SindhDormitory.Domain.Entities;

public abstract class BaseEntity
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public abstract class SoftDeletableEntity : BaseEntity
{
    public bool IsDeleted   { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
}
