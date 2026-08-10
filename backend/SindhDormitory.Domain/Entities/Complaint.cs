// =============================================================================
// Domain/Entities/Complaint.cs + ComplaintAttachment.cs
// =============================================================================
using SindhDormitory.Domain.Enums;

namespace SindhDormitory.Domain.Entities;

public class Complaint : SoftDeletableEntity
{
    public int               ComplaintId   { get; set; }
    public int               ResidentId    { get; set; }
    public ComplaintCategory Category      { get; set; }
    public string            Description   { get; set; } = string.Empty;
    public ComplaintStatus   Status        { get; set; } = ComplaintStatus.Open;
    public int?              AssignedToAdminId { get; set; }
    public string?           Resolution    { get; set; }
    public DateTime?         ResolvedAt    { get; set; }

    // Navigation
    public Resident                         Resident    { get; set; } = null!;
    public ICollection<ComplaintAttachment> Attachments { get; set; } = [];
}

public class ComplaintAttachment : BaseEntity
{
    public int    AttachmentId  { get; set; }
    public int    ComplaintId   { get; set; }
    public string FileUrl       { get; set; } = string.Empty;
    public string FileType      { get; set; } = string.Empty;  // image/pdf
    public long   FileSizeBytes { get; set; }

    // Navigation
    public Complaint Complaint { get; set; } = null!;
}
