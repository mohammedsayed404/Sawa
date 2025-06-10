using API.DTOs;
using API.Entities;
using API.Helper;
using API.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context , IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public void AddMessage(Message message)
            => _context.Messages.Add(message);
        public void DeleteMessage(Message message)
            => _context.Messages.Remove(message);

        public async Task<Message> GetMessage(int id)
            => await _context.Messages.FindAsync(id);
        public async Task<PagedList<MessageDto>> GetMessagesForUserAsync(MessageParams messageParams)
        {
            var query = _context.Messages.OrderByDescending(message => message.MessageSent).AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(message => message.RecipientUsername == messageParams.UserName
                && message.RecipientDeleted == false ), //message from other user to me
                "Outbox" => query.Where(message => message.SenderUsername == messageParams.UserName
                && message.SenderDeleted == false), // message from me to other users 
                _ =>
                    query.Where(message => message.RecipientUsername == messageParams.UserName
                    && message.RecipientDeleted == false && message.DateRead == null) // unread message 
            };
            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider).AsNoTracking();

            return await PagedList<MessageDto>.CreateAsync(messages,messageParams.PageNumber,messageParams.PageSize);
        }

        public async Task<IReadOnlyList<MessageDto>> GetMessagesThreadAsync(string currentUserName, string recipentUserName)
        {
            var messages = await _context.Messages
            .Include(u => u.Sender).ThenInclude(p => p.Photos)
            .Include(u => u.Recipient).ThenInclude(p => p.Photos)
            .Where(
                 m =>
                 (m.RecipientUsername == currentUserName &&
                  m.SenderUsername == recipentUserName &&
                   m.RecipientDeleted == false) ||
                 (m.RecipientUsername == recipentUserName &&
                  m.SenderUsername == currentUserName && m.SenderDeleted == false)

             ).OrderBy(m => m.MessageSent).ToListAsync(); //// from older to newer 
            //  ).OrderByDescending(m => m.MessageSent).ToListAsync(); // from newer to older 


            //unread msg that i send and recive user still not read it 
            // var unreadMessages = messages.Where(m => m.DateRead is null && m.RecipientUsername == recipentUserName).ToList();

            //unread msg that any one send to me and i still not read it  

            var unreadMessages = messages
                                        .Where(m => m.DateRead is null && m.RecipientUsername == currentUserName)
                                        .ToList();


            if (unreadMessages.Any())
            {
                foreach (var msg in unreadMessages)
                    msg.DateRead = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IReadOnlyList<MessageDto>>(messages);

        }

        public async Task<bool> SaveAllAsync()
            => await _context.SaveChangesAsync() > 0;
    }
}