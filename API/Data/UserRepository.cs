using API.DTOs;
using API.Entities;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context , IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<MemberDto>> GerMembersAsync()
            => await _context.Users.ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                                    .ToListAsync();

        public async Task<MemberDto> GetMemberByUserNameAsync(string userName)
            =>await _context.Users.ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                                    .SingleOrDefaultAsync(user => user.UserName == userName);
        public async Task<IReadOnlyList<AppUser>> GerUsersAsync()
            =>await _context.Users
                            .Include(user => user.Photos)
                            .ToListAsync();


        public async Task<AppUser> GetUserByIdAsync(int id)
            =>await _context.Users
                    .FindAsync(id);

        public async Task<AppUser> GetUserByUserNameAsync(string userName)
            =>await _context.Users
                            .Include(user => user.Photos)
                            .SingleOrDefaultAsync(user => user.UserName == userName);

        public async Task<bool> SaveAllAsync()
            => await _context.SaveChangesAsync() > 0 ;

        public void Update(AppUser user)
            =>_context.Users.Update(user);
    }
}