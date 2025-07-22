using Microsoft.EntityFrameworkCore;
using BenchPilot.Core.Models;
using System.Text.Json;

namespace BenchPilot.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // User Management
        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<UserLimit> UserLimits { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }

        // Core Business Entities
        public DbSet<Consultant> Consultants { get; set; }
        public DbSet<JobRequirement> JobRequirements { get; set; }
        public DbSet<Email> Emails { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<Submission> Submissions { get; set; }

        // System Management
        public DbSet<SystemAlert> SystemAlerts { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure User entity
            builder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                
                entity.HasOne(e => e.Role)
                    .WithMany(e => e.Users)
                    .HasForeignKey(e => e.RoleId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(e => e.Team)
                    .WithMany(e => e.Users)
                    .HasForeignKey(e => e.TeamId)
                    .OnDelete(DeleteBehavior.SetNull);
                
                entity.HasOne(e => e.UserLimit)
                    .WithOne(e => e.User)
                    .HasForeignKey<UserLimit>(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure UserRole entity
            builder.Entity<UserRole>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.RoleName).IsUnique();
            });

            // Configure Team entity
            builder.Entity<Team>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            // Configure UserLimit entity
            builder.Entity<UserLimit>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            // Configure UserActivity entity
            builder.Entity<UserActivity>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(e => e.User)
                    .WithMany(e => e.Activities)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Consultant entity
            builder.Entity<Consultant>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email);
                
                entity.Property(e => e.Skills)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                    );
                
                entity.HasOne(e => e.User)
                    .WithMany(e => e.Consultants)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(e => e.Team)
                    .WithMany(e => e.Consultants)
                    .HasForeignKey(e => e.TeamId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure JobRequirement entity
            builder.Entity<JobRequirement>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Skills)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                    );
                
                entity.Property(e => e.Requirements)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                    );
                
                entity.Property(e => e.NiceToHave)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                    );
                
                entity.HasOne(e => e.User)
                    .WithMany(e => e.JobRequirements)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(e => e.Team)
                    .WithMany(e => e.JobRequirements)
                    .HasForeignKey(e => e.TeamId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Email entity
            builder.Entity<Email>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(e => e.User)
                    .WithMany(e => e.Emails)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(e => e.Team)
                    .WithMany()
                    .HasForeignKey(e => e.TeamId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(e => e.RelatedJob)
                    .WithMany(e => e.RelatedEmails)
                    .HasForeignKey(e => e.RelatedJobId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Configure Match entity
            builder.Entity<Match>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.KeyStrengths)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                    );
                
                entity.Property(e => e.Concerns)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                    );
                
                entity.HasOne(e => e.Job)
                    .WithMany(e => e.Matches)
                    .HasForeignKey(e => e.JobId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(e => e.Consultant)
                    .WithMany(e => e.Matches)
                    .HasForeignKey(e => e.ConsultantId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(e => e.Team)
                    .WithMany()
                    .HasForeignKey(e => e.TeamId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Submission entity
            builder.Entity<Submission>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(e => e.Job)
                    .WithMany(e => e.Submissions)
                    .HasForeignKey(e => e.JobId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(e => e.Consultant)
                    .WithMany(e => e.Submissions)
                    .HasForeignKey(e => e.ConsultantId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(e => e.User)
                    .WithMany(e => e.Submissions)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(e => e.Team)
                    .WithMany()
                    .HasForeignKey(e => e.TeamId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure SystemAlert entity
            builder.Entity<SystemAlert>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
                
                entity.HasOne(e => e.Team)
                    .WithMany()
                    .HasForeignKey(e => e.TeamId)
                    .OnDelete(DeleteBehavior.SetNull);
                
                entity.HasOne(e => e.ResolvedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.ResolvedBy)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Seed initial data
            SeedData(builder);
        }

        private void SeedData(ModelBuilder builder)
        {
            // Seed User Roles
            builder.Entity<UserRole>().HasData(
                new UserRole { Id = 1, RoleName = "SuperAdmin", Description = "System-wide administrator with full access" },
                new UserRole { Id = 2, RoleName = "TeamAdmin", Description = "Team administrator managing recruiters" },
                new UserRole { Id = 3, RoleName = "Recruiter", Description = "Bench sales recruiter with limited access" }
            );

            // Seed Default Team
            builder.Entity<Team>().HasData(
                new Team { Id = 1, TeamName = "Trial Team", Description = "Default team for free trial recruiters", IsActive = true }
            );

            // Seed Super Admin User
            builder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FullName = "Super Admin",
                    Email = "admin@benchpilot.com",
                    Phone = "+1-555-0001",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                    RoleId = 1,
                    TeamId = null,
                    IsActive = true,
                    IsEmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );

            // Seed Team Admin User
            builder.Entity<User>().HasData(
                new User
                {
                    Id = 2,
                    FullName = "Team Admin",
                    Email = "teamadmin@benchpilot.com",
                    Phone = "+1-555-0002",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                    RoleId = 2,
                    TeamId = 1,
                    IsActive = true,
                    IsEmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );

            // Seed Sample Recruiter
            builder.Entity<User>().HasData(
                new User
                {
                    Id = 3,
                    FullName = "John Recruiter",
                    Email = "recruiter@benchpilot.com",
                    Phone = "+1-555-0003",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                    RoleId = 3,
                    TeamId = 1,
                    IsActive = true,
                    IsEmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );

            // Seed User Limits for Sample Recruiter
            builder.Entity<UserLimit>().HasData(
                new UserLimit
                {
                    Id = 1,
                    UserId = 3,
                    MaxResumes = 2,
                    MaxSubmissionsPerDay = 10,
                    MaxAIMatches = 1,
                    MaxResumeEnhancements = 3,
                    MaxSubmissionHistory = 5,
                    IsTrialUser = true,
                    TrialExpiryDate = DateTime.UtcNow.AddDays(30),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );
        }
    }
}