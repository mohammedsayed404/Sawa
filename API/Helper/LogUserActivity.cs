using API.Extensions;
using API.interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helper
{
    // public class LogUserActivitys : IAsyncActionFilter
    public class LogUserActivity : ActionFilterAttribute
    {
        // public Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        // {
        //     throw new NotImplementedException();
        // }


        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next?.Invoke();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resultContext.HttpContext.User.GetUserId();

            var userRepo = resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();

            var user = await userRepo.GetUserByIdAsync(int.Parse(userId));

            if (user is null) return;

            user.LastActive = DateTime.UtcNow;

            await userRepo.SaveAllAsync();


        }
    }
}