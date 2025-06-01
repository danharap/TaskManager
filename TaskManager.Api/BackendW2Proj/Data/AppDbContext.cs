using Microsoft.EntityFrameworkCore;
using BackendW2Proj.Models;

namespace BackendW2Proj.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<UserModel> Users { get; set; } // Users table
        public DbSet<TaskModel> Tasks { get; set; } // Tasks table
        public DbSet<SubTaskModel> SubTasks { get; set; } // SubTasks table
        public DbSet<NotificationModel> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Explicitly define table names and schema
            modelBuilder.Entity<UserModel>().ToTable("Users");
            modelBuilder.Entity<TaskModel>().ToTable("Tasks");
            modelBuilder.Entity<SubTaskModel>().ToTable("SubTasks");
            modelBuilder.Entity<NotificationModel>().ToTable("Notifications");
        }
    }
}
