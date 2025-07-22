using System.ComponentModel.DataAnnotations;

namespace BenchPilot.Core.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;
        
        [Phone]
        [MaxLength(20)]
        public string? Phone { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public int RoleId { get; set; }
        
        public int? TeamId { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public bool IsEmailConfirmed { get; set; } = false;
        
        [MaxLength(255)]
        public string? EmailConfirmationToken { get; set; }
        
        [MaxLength(255)]
        public string? PasswordResetToken { get; set; }
        
        public DateTime? PasswordResetExpiry { get; set; }
        
        public DateTime? LastLoginAt { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual UserRole Role { get; set; } = null!;
        public virtual Team? Team { get; set; }
        public virtual UserLimit? UserLimit { get; set; }
        public virtual ICollection<Consultant> Consultants { get; set; } = new List<Consultant>();
        public virtual ICollection<JobRequirement> JobRequirements { get; set; } = new List<JobRequirement>();
        public virtual ICollection<Email> Emails { get; set; } = new List<Email>();
        public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public virtual ICollection<UserActivity> Activities { get; set; } = new List<UserActivity>();
    }
    
    public class UserRole
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string RoleName { get; set; } = string.Empty;
        
        [MaxLength(200)]
        public string? Description { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<User> Users { get; set; } = new List<User>();
    }
    
    public class Team
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string TeamName { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<User> Users { get; set; } = new List<User>();
        public virtual ICollection<Consultant> Consultants { get; set; } = new List<Consultant>();
        public virtual ICollection<JobRequirement> JobRequirements { get; set; } = new List<JobRequirement>();
    }
    
    public class UserLimit
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        public int MaxResumes { get; set; } = 2;
        
        public int MaxSubmissionsPerDay { get; set; } = 10;
        
        public int MaxAIMatches { get; set; } = 1;
        
        public int MaxResumeEnhancements { get; set; } = 3;
        
        public int MaxSubmissionHistory { get; set; } = 5;
        
        public bool IsTrialUser { get; set; } = true;
        
        public DateTime? TrialExpiryDate { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
    }
    
    public class UserActivity
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string ActivityType { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [MaxLength(45)]
        public string? IPAddress { get; set; }
        
        [MaxLength(500)]
        public string? UserAgent { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
    }
}