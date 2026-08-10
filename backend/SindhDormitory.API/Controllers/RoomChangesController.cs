using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SindhDormitory.Application.DTOs.Residency;
using SindhDormitory.Application.Interfaces;

namespace SindhDormitory.API.Controllers;

[ApiController]
[Route("api/room-changes")]
[Authorize(Roles = "Student")]
public class RoomChangesController : ControllerBase
{
    private readonly IResidencyService _residencyService;
    private readonly IFileUploadService _fileUploadService;

    public RoomChangesController(IResidencyService residencyService, IFileUploadService fileUploadService)
    {
        _residencyService = residencyService;
        _fileUploadService = fileUploadService;
    }

    /// <summary>GET /api/room-changes — Get all room change requests for the current student.</summary>
    [HttpGet]
    public async Task<IActionResult> GetRoomChangeRequests()
    {
        try
        {
            var userId = GetCurrentUserId();
            var requests = await _residencyService.GetStudentRoomChangeRequestsAsync(userId);
            return Ok(requests);
        }
        catch (Exception ex) { return StatusCode(500, new { message = ex.Message }); }
    }

    /// <summary>GET /api/room-changes/{id} — Get a specific room change request (ownership enforced server-side).</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetRoomChangeRequestById(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var request = await _residencyService.GetRoomChangeRequestByIdAsync(userId, id);
            return Ok(request);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (Exception ex) { return StatusCode(500, new { message = ex.Message }); }
    }

    /// <summary>
    /// POST /api/room-changes — Submit a room change request.
    /// Accepts multipart/form-data so that an optional supporting document/image can be uploaded.
    /// File upload: max 5 MB, allowed extensions: .jpg, .jpeg, .png, .pdf, .doc, .docx
    /// Ownership is enforced server-side — only the actual current resident can submit.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateRoomChangeRequest(
        [FromForm] CreateRoomChangeRequestDto dto,
        IFormFile? attachment)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var userId = GetCurrentUserId();

            if (attachment != null)
            {
                if (attachment.Length == 0)
                    return BadRequest(new { message = "Attachment file is empty." });

                using var stream = attachment.OpenReadStream();
                var uploadedUrl = await _fileUploadService.UploadFileAsync(
                    stream, attachment.FileName, attachment.ContentType, "room-changes");
                dto.AttachmentUrl = uploadedUrl;
            }

            var created = await _residencyService.CreateRoomChangeRequestAsync(userId, dto);
            return CreatedAtAction(nameof(GetRoomChangeRequestById), new { id = created.RequestId }, created);
        }
        catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
        catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (Exception ex) { return StatusCode(500, new { message = ex.Message }); }
    }

    private int GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? User.FindFirst("sub")?.Value
                    ?? User.FindFirst("userId")?.Value;

        if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out int userId))
            throw new UnauthorizedAccessException("User claim missing.");

        return userId;
    }
}
