using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SindhDormitory.Application.Interfaces;

namespace SindhDormitory.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AnnouncementsController : ControllerBase
{
    private readonly IPublicService _publicService;

    public AnnouncementsController(IPublicService publicService)
    {
        _publicService = publicService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAnnouncements()
    {
        var announcements = await _publicService.GetAnnouncementsAsync();
        return Ok(announcements);
    }
}
