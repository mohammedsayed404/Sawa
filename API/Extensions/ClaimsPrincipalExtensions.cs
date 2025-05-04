using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserName(this ClaimsPrincipal user)
         =>  user.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}