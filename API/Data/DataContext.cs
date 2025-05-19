using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserLike>().HasKey(key => new { key.SourceUserId, key.TargetUserId });

            modelBuilder.Entity<UserLike>()
                .HasOne(userLike => userLike.SourceUser)
                .WithMany(sourceUser => sourceUser.LikedUsers)
                .HasForeignKey(userLike => userLike.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserLike>()
                .HasOne(userLike => userLike.TargetUser)
                .WithMany(targetUser => targetUser.LikedByUsers)
                .HasForeignKey(userLike => userLike.TargetUserId)
                .OnDelete(DeleteBehavior.Cascade);

        }

        public DbSet<AppUser> Users => Set<AppUser>();
        public DbSet<UserLike> Likes => Set<UserLike>();



    }
}