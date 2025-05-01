using API.Data;
using API.Helper;
using API.interfaces;
using API.services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration config)
        {
            services.AddDbContext<DataContext>(opt =>
                {
                    opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
                });
            services.AddCors();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddAutoMapper(typeof(MappingProfiles));


            return services;
        }



    }
}