using API.DTOs;
using API.Entities;
using API.Helper;

namespace API.interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<bool> SaveAllAsync();

        Task<IReadOnlyList<AppUser>> GerUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUserNameAsync(string userName);

        Task<PagedList<MemberDto>> GerMembersAsync(UserParams userParams);
        Task<MemberDto> GetMemberByUserNameAsync(string userName);
    }
}