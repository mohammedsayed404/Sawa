using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public static class Seed
    {
        public static async Task SeedUsers(DataContext context)
        {
            if (!await context.Users.AnyAsync()) 
            {
                var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
                var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
                if (users == null) return;
                foreach (var user in users)
                {
                    using var hmac = new HMACSHA512();
                    user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("123"));
                    user.PasswordSalt = hmac.Key;
                    user.UserName = user.UserName.ToLower();
                    context.Users.Add(user);
                }
                await context.SaveChangesAsync(); 




            }
           

         }
    }

}