using Microsoft.Extensions.Hosting;
using SindhDormitory.Application.Interfaces;

namespace SindhDormitory.Infrastructure.Services;

public class FileUploadService : IFileUploadService
{
    private readonly IHostEnvironment _environment;
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx" };
    private const long MaxFileSizeInBytes = 5 * 1024 * 1024; // 5 MB

    public FileUploadService(IHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, string subFolder)
    {
        if (fileStream == null || fileStream.Length == 0)
            throw new ArgumentException("No file content provided.");

        if (fileStream.Length > MaxFileSizeInBytes)
            throw new ArgumentException("File size exceeds maximum allowed limit of 5 MB.");

        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            throw new ArgumentException($"Invalid file extension. Allowed extensions: {string.Join(", ", AllowedExtensions)}");

        // Safe unique filename
        var safeFileName = $"{Guid.NewGuid()}{extension}";
        var uploadDir = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads", subFolder);

        if (!Directory.Exists(uploadDir))
        {
            Directory.CreateDirectory(uploadDir);
        }

        var filePath = Path.Combine(uploadDir, safeFileName);
        using (var destinationStream = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(destinationStream);
        }

        return $"/uploads/{subFolder}/{safeFileName}";
    }
}
