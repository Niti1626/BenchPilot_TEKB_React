using System.ComponentModel.DataAnnotations;

namespace BenchPilot.Core.Models
{
    public class Consultant
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Phone]
        public string Phone { get; set; } = string.Empty;
        
        public List<string> Skills { get; set; } = new();
        
        [Range(0, 50)]
        public int Experience { get; set; }
        
        [MaxLength(200)]
        public string Location { get; set; } = string.Empty;
        
        [Range(0, 1000)]
        public decimal Rate { get; set; }
        
        [MaxLength(20)]
        public string RateType { get; set; } = "Hourly";
        
        [MaxLength(20)]
        public string Availability { get; set; } = "Available";
        
        public DateTime LastSubmitted { get; set; }
        
        [Range(0, 5)]
        public double Rating { get; set; }
        
        public int TotalSubmissions { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public string? ResumeFileName { get; set; }
        
        public string? Notes { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public virtual ICollection<Match> Matches { get; set; } = new List<Match>();
    }
}