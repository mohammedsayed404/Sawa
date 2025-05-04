using API.DTOs;
using CloudinaryDotNet.Actions;

namespace API.interfaces
{
public interface IPhotoService
{

     Task<ImageUploadResult> AddPhotoAsync(IFormFile file);

     Task<bool> DeletePhotoAsync(string publicId);

}

}