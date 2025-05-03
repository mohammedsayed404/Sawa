using API.DTOs;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<MemberDto>>> GetUsers()
            => Ok(await _userRepository.GerMembersAsync());

        [HttpGet("{id:int}")]
        public async Task<ActionResult<MemberDto>> GetUser(int id)
            => Ok(_mapper.Map<MemberDto>(await _userRepository.GetUserByIdAsync(id)));

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
            => Ok(await _userRepository.GetMemberByUserNameAsync(username));

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var userName = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _userRepository.GetUserByUserNameAsync(userName);

            if (user is null) return NotFound("User not found");

            _mapper.Map(memberUpdateDto, user);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");

        }
    }
}