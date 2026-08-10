using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SindhDormitory.Application.DTOs.Auth;
using SindhDormitory.Application.Interfaces;

namespace SindhDormitory.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("student-login")]
    [AllowAnonymous]
    public async Task<IActionResult> LoginStudent([FromBody] StudentLoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
            {
                var response = await _authService.LoginStudentAsync(request);
                return Ok(response);
            }
        catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login.", details = ex.Message });
            }
    }

    [HttpPost("admin-login")]
    [AllowAnonymous]
    public async Task<IActionResult> LoginAdmin([FromBody] AdminLoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
            {
                var response = await _authService.LoginAdminAsync(request);
                return Ok(response);
            }
        catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login.", details = ex.Message });
            }
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> RegisterStudent([FromBody] RegisterStudentRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
            {
                var response = await _authService.RegisterStudentAsync(request);
                return Ok(response);
            }
        catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during registration.", details = ex.Message });
            }
    }
}
