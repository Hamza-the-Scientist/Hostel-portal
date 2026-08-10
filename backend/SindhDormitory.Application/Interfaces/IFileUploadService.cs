namespace SindhDormitory.Application.Interfaces;

public interface IFileUploadService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, string subFolder);
}
