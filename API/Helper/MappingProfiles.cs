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
                            opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));


            CreateMap<MemberUpdateDto, AppUser>();

            CreateMap<RegisterDto, AppUser>();

            CreateMap<Message, MessageDto>()
            .ForMember(dest => dest.SenderPhotoUrl,
             opt => opt.MapFrom(
                src => src.Sender.Photos.FirstOrDefault(user => user.IsMain).Url))
            .ForMember(dest => dest.RecipientPhotoUrl,
             opt => opt.MapFrom(
                src => src.Recipient.Photos.FirstOrDefault(user => user.IsMain).Url));


            CreateMap<Photo, PhotoDto>();
            // CreateMap<Photo,PhotoDto>()
            //         .ForMember(dest => dest.Url,opt => opt.MapFrom<PhotoResolver>());


            CreateMap<DateTime, DateTime>()
            .ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));

            CreateMap<DateTime?, DateTime?>()
            .ConvertUsing(d => d.HasValue ? DateTime.SpecifyKind(d.Value,DateTimeKind.Utc) : null );

        }
    }
}