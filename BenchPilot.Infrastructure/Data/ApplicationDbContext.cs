using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using BenchPilot.Core.Models;
using System.Text.Json;

namespace BenchPilot.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Consultant> Consultants { get; set; }
        public DbSet<JobRequirement> JobRequirements { get; set; }
        public DbSet<Email> Emails { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<Submission> Submissions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure Consultant entity
            builder.Entity<Consultant>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                
                entity.Property(e => e.Skills)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                    );
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
            });

            // Configure Match entity
            builder.Entity<Match>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(e => e.Job)
                    .WithMany(e => e.Matches)
                    .HasForeignKey(e => e.JobId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(e => e.Consultant)
                    .WithMany(e => e.Matches)
                    .HasForeignKey(e => e.ConsultantId)
                    .OnDelete(DeleteBehavior.Cascade);
                
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
            });

            // Configure Email entity
            builder.Entity<Email>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(e => e.RelatedJob)
                    .WithMany(e => e.RelatedEmails)
                    .HasForeignKey(e => e.RelatedJobId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Seed data
            SeedData(builder);
        }

        private void SeedData(ModelBuilder builder)
        {
            // Seed Consultants
            builder.Entity<Consultant>().HasData(
                new Consultant
                {
                    Id = 1,
                    Name = "Alex Rodriguez",
                    Email = "alex.rodriguez@email.com",
                    Phone = "+1 (555) 123-4567",
                    Skills = new List<string> { "React", "Node.js", "AWS", "TypeScript", "GraphQL" },
                    Experience = 8,
                    Location = "New York, NY",
                    Rate = 85,
                    RateType = "Hourly",
                    Availability = "Available",
                    LastSubmitted = DateTime.UtcNow.AddDays(-5),
                    Rating = 4.8,
                    TotalSubmissions = 23
                },
                new Consultant
                {
                    Id = 2,
                    Name = "Maria Chen",
                    Email = "maria.chen@email.com",
                    Phone = "+1 (555) 234-5678",
                    Skills = new List<string> { "Docker", "Kubernetes", "CI/CD", "Python", "Terraform" },
                    Experience = 6,
                    Location = "San Francisco, CA",
                    Rate = 90,
                    RateType = "Hourly",
                    Availability = "On Project",
                    LastSubmitted = DateTime.UtcNow.AddDays(-7),
                    Rating = 4.9,
                    TotalSubmissions = 18
                },
                new Consultant
                {
                    Id = 3,
                    Name = "David Kim",
                    Email = "david.kim@email.com",
                    Phone = "+1 (555) 345-6789",
                    Skills = new List<string> { "Python", "Machine Learning", "TensorFlow", "SQL", "R" },
                    Experience = 5,
                    Location = "Austin, TX",
                    Rate = 95,
                    RateType = "Hourly",
                    Availability = "Available",
                    LastSubmitted = DateTime.UtcNow.AddDays(-2),
                    Rating = 4.7,
                    TotalSubmissions = 15
                }
            );

            // Seed Job Requirements
            builder.Entity<JobRequirement>().HasData(
                new JobRequirement
                {
                    Id = 1,
                    Title = "Senior React Developer",
                    Client = "TechCorp Inc.",
                    ClientContact = "Sarah Johnson",
                    ClientEmail = "hiring@techcorp.com",
                    ClientPhone = "+1 (555) 123-4567",
                    Status = "active",
                    Priority = "High",
                    Location = "Remote",
                    JobType = "Contract",
                    Duration = "6 months",
                    Rate = "$80-100/hour",
                    RateType = "Hourly",
                    Experience = 5,
                    Skills = new List<string> { "React", "TypeScript", "Node.js", "AWS", "GraphQL" },
                    Description = "We are looking for a Senior React Developer with extensive experience in modern React development, TypeScript, and cloud technologies.",
                    Requirements = new List<string> { "5+ years of React development experience", "Strong TypeScript skills", "Experience with Node.js and Express", "AWS cloud platform knowledge", "GraphQL API development" },
                    NiceToHave = new List<string> { "Next.js experience", "Docker containerization", "CI/CD pipeline setup" },
                    Source = "email_extraction",
                    AiConfidence = 95,
                    SubmissionsCount = 8,
                    MatchesCount = 12,
                    ViewsCount = 45,
                    RecruiterAssigned = "John Doe",
                    Urgency = "High",
                    ClientRating = 4.8,
                    Budget = 50000,
                    StartDate = DateTime.UtcNow.AddDays(15)
                },
                new JobRequirement
                {
                    Id = 2,
                    Title = "DevOps Engineer",
                    Client = "Innovate Solutions",
                    ClientContact = "Mike Chen",
                    ClientEmail = "mike@innovate.com",
                    ClientPhone = "+1 (555) 234-5678",
                    Status = "active",
                    Priority = "Medium",
                    Location = "San Francisco, CA",
                    JobType = "Full-time",
                    Duration = "Permanent",
                    Rate = "$120,000-150,000",
                    RateType = "Annual",
                    Experience = 4,
                    Skills = new List<string> { "Docker", "Kubernetes", "CI/CD", "Python", "Terraform" },
                    Description = "Looking for a DevOps Engineer to join our growing team. You will be responsible for maintaining our cloud infrastructure.",
                    Requirements = new List<string> { "4+ years of DevOps experience", "Strong Docker and Kubernetes skills", "CI/CD pipeline implementation", "Python scripting abilities", "Infrastructure as Code (Terraform)" },
                    NiceToHave = new List<string> { "AWS certification", "Monitoring tools experience", "Security best practices" },
                    Source = "email_extraction",
                    AiConfidence = 88,
                    SubmissionsCount = 5,
                    MatchesCount = 8,
                    ViewsCount = 32,
                    RecruiterAssigned = "Jane Smith",
                    Urgency = "Medium",
                    ClientRating = 4.6,
                    Budget = 135000,
                    StartDate = DateTime.UtcNow.AddDays(30)
                }
            );

            // Seed Emails
            builder.Entity<Email>().HasData(
                new Email
                {
                    Id = 1,
                    From = "hiring@techcorp.com",
                    FromName = "Sarah Johnson - TechCorp",
                    Subject = "Urgent: Senior React Developer Position - Remote",
                    Preview = "We have an immediate need for a Senior React Developer with 5+ years experience...",
                    Body = "We have an immediate need for a Senior React Developer with 5+ years experience in modern React, TypeScript, and Node.js. The role is fully remote and offers competitive compensation.",
                    Timestamp = DateTime.UtcNow.AddHours(-2),
                    IsRead = false,
                    Status = "new",
                    Priority = "High",
                    AiConfidence = 95,
                    HasAttachment = true,
                    Category = "job_requirement",
                    RelatedJobId = 1
                },
                new Email
                {
                    Id = 2,
                    From = "recruiter@innovate.com",
                    FromName = "Mike Chen - Innovate Solutions",
                    Subject = "DevOps Engineer - San Francisco",
                    Preview = "Looking for a DevOps Engineer with Docker and Kubernetes experience...",
                    Body = "Looking for a DevOps Engineer with Docker and Kubernetes experience to join our team in San Francisco.",
                    Timestamp = DateTime.UtcNow.AddHours(-3),
                    IsRead = false,
                    Status = "new",
                    Priority = "Medium",
                    AiConfidence = 88,
                    HasAttachment = false,
                    Category = "job_requirement",
                    RelatedJobId = 2
                }
            );
        }
    }
}