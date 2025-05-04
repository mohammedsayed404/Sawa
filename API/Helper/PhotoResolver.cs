using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.Extensions.Options;

namespace API.Helper
{
    public class PhotoResolver : IValueResolver<Photo, PhotoDto, string>
    {
        private readonly IOptionsMonitor<CloudinarySettings> _config;

        public PhotoResolver(IOptionsMonitor<CloudinarySettings> config)
        {
            _config = config;
        }
        public string Resolve(Photo source, PhotoDto destination, string destMember, ResolutionContext context)
        {
            if (!String.IsNullOrWhiteSpace(source.Url))
                return $"{_config.CurrentValue.CloudinaryBaseUrl}{source.Url}";

            return string.Empty;
        }
    }
}