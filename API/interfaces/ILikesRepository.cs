using API.DTOs;
using API.Entities;
using API.Helper;

namespace API.interfaces
{
    public interface ILikesRepository
    {
        //get the entity itself specific user with specific like person 
        Task<UserLike> GetUserLikeAsync(int SourceUserId, int TargetUserId);

        // get user and his liked person [me with users that i make like to them]
        Task<AppUser> GetUserWithLikesAsync(int userId);


        //get user that make like to you or get users that you make like to them
        //both liked [users that i make like to them ] or likedBy [user they make like to me ]   
        Task<PagedList<LikeDto>> GetUserLikesAsync(LikesParams likesParams); 


    }
}