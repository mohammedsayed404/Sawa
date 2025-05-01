using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.PhotoUrl, 
                            opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.Age,
                            opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));            ;
            CreateMap<Photo, PhotoDto>();
        }
    }
}