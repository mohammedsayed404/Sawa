using API.DTOs;
using API.Entities;

namespace API.interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<bool> SaveAllAsync();

        Task<IReadOnlyList<AppUser>> GerUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUserNameAsync(string userName);

        Task<IReadOnlyList<MemberDto>> GerMembersAsync();
        Task<MemberDto> GetMemberByUserNameAsync(string userName);
    }
}