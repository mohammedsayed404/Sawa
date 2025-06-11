using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;

        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            var username = Context.User.GetUserName();

            var isOnline = await _tracker.UserConnectedAsync(username, Context.ConnectionId);

            if (isOnline)
                await Clients.Others.SendAsync("UserIsOnline", username);

            var currentOnlineUsers = await _tracker.GetOnlineUsersAsync();
            // await Clients.All.SendAsync("GetOnlineUsers", currentOnlineUsers);
            await Clients.Caller.SendAsync("GetOnlineUsers", currentOnlineUsers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var username = Context.User.GetUserName();

            var isOffline = await _tracker.UserDisconnectedAsync(username, Context.ConnectionId);

            if (isOffline)
                await Clients.Others.SendAsync("UserIsOffline", username);

            // var currentOnlineUsers = await _tracker.GetOnlineUsersAsync();
            // await Clients.All.SendAsync("GetOnlineUsers", currentOnlineUsers);
            await base.OnDisconnectedAsync(exception);
        }
    }
}