using API.DTOs;
using API.Helper;
using API.interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
namespace API.services
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;
        private readonly IOptionsMonitor<CloudinarySettings> _config;

        public PhotoService(IOptionsMonitor<CloudinarySettings> config)
        {
            var account = new Account
            {
                Cloud = config.CurrentValue.CloudName,
                ApiKey = config.CurrentValue.ApiKey,
                ApiSecret = config.CurrentValue.ApiSecret,

            };

            _cloudinary = new Cloudinary(account);
            _config = config;
        }



        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if (file?.Length > 0)
            {
                using var stream = file.OpenReadStream();

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation()
                                        .Height(500).Width(500).Crop("fill")
                                        .Gravity("face"),
                    Folder = "Dating-app-users"
                };

                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }

            if (uploadResult.Error is not null)
                return null!; // we can log error best of this . [i will cover it later ]

            return uploadResult;


        }


        public async Task<bool> DeletePhotoAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);

            var result = await _cloudinary.DestroyAsync(deleteParams);

            if (result.Error is not null)
                return false;

            return true;
        }
    }

}