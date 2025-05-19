using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helper;
using API.interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly ILikesRepository _likesRepository;

        public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
        {
            _userRepository = userRepository;
            _likesRepository = likesRepository;
        }


        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            // get user with this name , and make login user like him 
            // var SourceUserId = int.Parse(User.GetUserId());
            // var likedUser = await _userRepository.GetUserByUserNameAsync(username);
            // if (likedUser is null) return NotFound();
            // var userlike = new UserLike
            // {
            //     SourceUserId = SourceUserId,
            //     TargetUserId = likedUser.Id
            // };


            // _likesRepository.



            var SourceUserId = User.GetUserId();
         
            var likedUser = await _userRepository.GetUserByUserNameAsync(username);
          
            if (likedUser is null) return NotFound();

            var SourceUser = await _likesRepository.GetUserWithLikesAsync(SourceUserId);

            if (SourceUser.UserName == username) return BadRequest("you can't liked yourself");

            var userLike = await _likesRepository.GetUserLikeAsync(SourceUserId, likedUser.Id);
            if (userLike is not null) return BadRequest("you already like this user");

            var userlike = new UserLike
            {
                SourceUserId = SourceUserId,
                TargetUserId = likedUser.Id
            };

            SourceUser.LikedUsers.Add(userlike);

            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest($"problem happen when you like {username} try again later.");


        }


        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
        {
            //get user with users liked or users like him basedon predicate
            likesParams.UserId = User.GetUserId();
            var likedUsers = await _likesRepository.GetUserLikesAsync(likesParams);

            Response.AddPaginationHeader(
                new PaginationHeader
                (likedUsers.CurrentPage, likedUsers.PageSize, likedUsers.TotalCount, likedUsers.TotalPages));

            return Ok(likedUsers);
            
        }









    }
}