using System.ComponentModel.DataAnnotations;

namespace BenchPilot.Core.Models
{
    public class JobRequirement
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Client { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string ClientContact { get; set; } = string.Empty;
        
        [EmailAddress]
        public string ClientEmail { get; set; } = string.Empty;
        
        [Phone]
        public string ClientPhone { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string Status { get; set; } = "active";
        
        [MaxLength(10)]
        public string Priority { get; set; } = "Medium";
        
        [MaxLength(100)]
        public string Location { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string JobType { get; set; } = "Contract";
        
        [MaxLength(50)]
        public string Duration { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string Rate { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string RateType { get; set; } = "Hourly";
        
        [Range(0, 50)]
        public int Experience { get; set; }
        
        public List<string> Skills { get; set; } = new();
        
        public string Description { get; set; } = string.Empty;
        
        public List<string> Requirements { get; set; } = new();
        
        public List<string> NiceToHave { get; set; } = new();
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
        
        [MaxLength(50)]
        public string Source { get; set; } = "manual_entry";
        
        [Range(0, 100)]
        public int? AiConfidence { get; set; }
        
        public int SubmissionsCount { get; set; }
        
        public int MatchesCount { get; set; }
        
        public int ViewsCount { get; set; }
        
        [MaxLength(100)]
        public string RecruiterAssigned { get; set; } = string.Empty;
        
        [MaxLength(10)]
        public string Urgency { get; set; } = "Medium";
        
        [Range(0, 5)]
        public double ClientRating { get; set; }
        
        [Range(0, 1000000)]
        public decimal Budget { get; set; }
        
        public DateTime StartDate { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public virtual ICollection<Match> Matches { get; set; } = new List<Match>();
        public virtual ICollection<Email> RelatedEmails { get; set; } = new List<Email>();
    }
}