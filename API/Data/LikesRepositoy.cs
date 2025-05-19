using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helper;
using API.interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepositoy : ILikesRepository
    {
        private readonly DataContext _context;

        public LikesRepositoy(DataContext context)
        {
            _context = context;
        }
        public async Task<UserLike> GetUserLikeAsync(int SourceUserId, int TargetUserId)
            => await _context.Likes.FindAsync(SourceUserId, TargetUserId);
        public async Task<PagedList<LikeDto>> GetUserLikesAsync(LikesParams likesParams)
        {
            // var users = _context.Users.OrderBy(user => user.UserName).AsQueryable();
            // var likes = _context.Likes.AsQueryable();

            // if (predicate == "liked")
            // {
            //     //get all user that usersource liked  
            //     likes = likes.Where(userLike => userLike.SourceUserId == userId);
            //     users = likes.Select(userLike => userLike.TargetUser);
            // }
            // if (predicate == "likedBy")
            // {
            //     //get all user that make like to me   
            //     likes = likes.Where(userLike => userLike.TargetUserId == userId);
            //     users = likes.Select(userLike => userLike.SourceUser);
            // }

            var users = likesParams.Predicate switch
            {
                "liked" => _context.Likes.Where(userLike => userLike.SourceUserId == likesParams.UserId)
                                        .Select(targets => targets.TargetUser),
                "likedBy" => _context.Likes.Where(userLike => userLike.TargetUserId == likesParams.UserId)
                                        .Select(likedby => likedby.SourceUser),
                _ => Enumerable.Empty<AppUser>().AsQueryable()
            };

            var likedUsers = users.OrderBy(user => user.UserName).Select(user => new LikeDto
            {
                Id = user.Id,
                UserName = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(photo => photo.IsMain).Url,
                City = user.City,
            }).AsNoTracking();

            return await PagedList<LikeDto>.CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);

        }

        public async Task<AppUser> GetUserWithLikesAsync(int userId)
            => await _context.Users.Include(user => user.LikedUsers)
                .FirstOrDefaultAsync(user => user.Id == userId);
    }
}