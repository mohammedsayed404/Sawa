using API.Data;
using API.Extensions;
using API.Middlewares;
using API.SignalR;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// ! to make our service with dbcontext injected to all class in our app and make it iton our method extention
builder.Services.AddApplicationServices(builder.Configuration);

// ? to make our jwt configration scheme and seperated it into method extension
builder.Services.AddIdentityService(builder.Configuration);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();;
    try
    {
        await context.Database.MigrateAsync();
        // await context.Database.ExecuteSqlAsync($"TRUNCATE TABLE Connections");//not work with sqlite
        await context.Database.ExecuteSqlAsync($"DELETE FROM  Connections");
        await Seed.SeedUsers(context);
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during migration");
    }
}


app.UseMiddleware<ExceptionMiddleware>();
// Configure the HTTP request pipeline.
app.UseCors(builder => builder.AllowAnyHeader()
.AllowAnyMethod()
.AllowCredentials()
.WithOrigins("http://localhost:4200"));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");

app.Run();
