using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserName(this ClaimsPrincipal user)
         => user.FindFirstValue(ClaimTypes.Name);
         
        public static string GetUserId(this ClaimsPrincipal user)
         =>  user.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}