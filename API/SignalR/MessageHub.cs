using System.Security.AccessControl;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _presenceHub;

        public MessageHub(IMessageRepository messageRepository,
        IUserRepository userRepository, IMapper mapper , IHubContext<PresenceHub> presenceHub)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _presenceHub = presenceHub;
            _messageRepository = messageRepository;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"];
            var caller = Context.User.GetUserName();
            var groupName = GetGroupName(caller, otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

           var group =  await AddToGroupIntoDbAsync(groupName); //to save into our db 

            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            var messages = await _messageRepository.GetMessagesThreadAsync(caller, otherUser);

            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);

        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var group =  await RemoveFromMessageGroupAsync();
            await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);

            await base.OnDisconnectedAsync(exception);
        }


        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var username = Context.User.GetUserName();

            if (username == createMessageDto.RecipientUsername.ToLower())
                throw new HubException("you can't send message to yourself");

            var sender = await _userRepository.GetUserByUserNameAsync(username);
            var recipent = await _userRepository.GetUserByUserNameAsync(createMessageDto.RecipientUsername);

            if (recipent is null) throw new HubException("Not Found User");


            var message = new Message
            {
                Sender = sender,
                Recipient = recipent,
                SenderUsername = sender.UserName,
                RecipientUsername = recipent.UserName,
                Content = createMessageDto.Content
            };

            var groupName = GetGroupName(sender.UserName, recipent.UserName);

            var group = await _messageRepository.GetMessageGroupAsync(groupName);

            if (group.Connections.Any(c => c.Username == recipent.UserName))
                message.DateRead = DateTime.UtcNow;
            else
            {
                var connectionIds = await PresenceTracker.GetConnectionsForUserAsync(recipent.UserName);
                if (connectionIds is not null)
                {
                    await _presenceHub.Clients.Clients(connectionIds).SendAsync("NewMessageReceived",
                    new { username = sender.UserName, KnownAs = sender.KnownAs });
                } 
            }    

            _messageRepository.AddMessage(message);


            if (await _messageRepository.SaveAllAsync())
                await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));

        }

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.Compare(caller, other) < 0;

            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }


        private async Task<Group> AddToGroupIntoDbAsync(string groupName)
        {
            var group = await _messageRepository.GetMessageGroupAsync(groupName);
            var connection = new Connection
            {
                ConnectionId = Context.ConnectionId,
                Username = Context.User.GetUserName()
            };

            if (group is null)
            {
                group = new Group { Name = groupName };
                _messageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);
            if (await _messageRepository.SaveAllAsync()) return group;

           throw new HubException("faild to add to group");

            
        }


        private async Task<Group> RemoveFromMessageGroupAsync()
        {
            var group = await _messageRepository.GetGroupForConnectionAsync(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault( c => c.ConnectionId == Context.ConnectionId);
            _messageRepository.RemoveConnection(connection);
            if(await _messageRepository.SaveAllAsync()) return group;
           throw new HubException("faild to remove from group");
            //we don't remove it from group cause signalR do it auto inside OnDisconnectedAsync

        }

    }
}