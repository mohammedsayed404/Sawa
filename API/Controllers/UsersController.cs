using API.Data;
using API.DTOs;
using API.Entities;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository , IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }
      
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<MemberDto>>> GetUsers()
            =>Ok(await _userRepository.GerMembersAsync());

        [HttpGet("{id:int}")]
        public async Task<ActionResult<MemberDto>> GetUser(int id)
            =>Ok(_mapper.Map<MemberDto>(await _userRepository.GetUserByIdAsync(id)));

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
            =>Ok(await _userRepository.GetMemberByUserNameAsync(username));
    }
}