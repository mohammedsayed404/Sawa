using API.DTOs;
using API.Entities;
using API.Helper;

namespace API.interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);

        Task<Message> GetMessage(int id);


        Task<PagedList<MessageDto>> GetMessagesForUserAsync(MessageParams messageParams);
        Task<IReadOnlyList<MessageDto>> GetMessagesThreadAsync(string currentUserName, string recipentUserName); //make it userName cause easy to get grom message params 

        Task<bool> SaveAllAsync();

    }
}