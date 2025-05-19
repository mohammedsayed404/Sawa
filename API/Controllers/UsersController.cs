using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helper;
using API.interfaces;
using AutoMapper;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {

            var CurrentUser = await _userRepository.GetUserByUserNameAsync(User.GetUserName());
            userParams.CurrentUserName = CurrentUser.UserName;

            if (string.IsNullOrWhiteSpace(userParams.Gender))
                userParams.Gender = CurrentUser.Gender == "male" ? "female" : "male";

            var users = await _userRepository.GerMembersAsync(userParams);

            Response.AddPaginationHeader(
                new PaginationHeader(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages));   
             return Ok(users);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<MemberDto>> GetUser(int id)
            => Ok(_mapper.Map<MemberDto>(await _userRepository.GetUserByIdAsync(id)));

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
            => Ok(await _userRepository.GetMemberByUserNameAsync(username));

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {

            var user = await _userRepository.GetUserByUserNameAsync(User.GetUserName());

            if (user is null) return NotFound("User not found");

            _mapper.Map(memberUpdateDto, user);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");

        }


        [HttpPost("add-photo")]
        public async Task<ActionResult> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUserName());

            if (user is null) return NotFound();

            var result = await _photoService.AddPhotoAsync(file);

            if (result is null) return BadRequest();

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0)
                photo.IsMain = true;

            user.Photos.Add(photo);

            if (await _userRepository.SaveAllAsync())
                return CreatedAtAction(
                    actionName: nameof(GetUser),
                    routeValues: new { username = user.UserName },
                    value: _mapper.Map<PhotoDto>(photo)
                );

            return BadRequest("Problem , Can't add photo pls try again later.");


        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {

            //user -> photoes -> take with this id -> update isMain = true -> isMainOld -> false 

            var user = await _userRepository.GetUserByUserNameAsync(User.GetUserName());

            if (user is null) return NotFound();

            var oldMainPhoto = user.Photos.FirstOrDefault(photo => photo.IsMain);
            if (oldMainPhoto is not null) oldMainPhoto.IsMain = false;

            var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);

            if (photo is null) return NotFound();
            if (photo.IsMain) return BadRequest("this is already your main photo .");

            photo.IsMain = true;

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Problem setting the main photo ");

        }



        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> RemovePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUserName());
            if (user is null) return NotFound();

            var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);

            if (photo is null) return NotFound();
            if (photo.IsMain) return BadRequest("Can't delete  main photo .");




            if (photo.PublicId is not null && await _photoService.DeletePhotoAsync(photo.PublicId))
                    user.Photos.Remove(photo);

            if (await _userRepository.SaveAllAsync())
                    return Ok();

            return BadRequest("Problem setting the main photo ");


        }

    }
}