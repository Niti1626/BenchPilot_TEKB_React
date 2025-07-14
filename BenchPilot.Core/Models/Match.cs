using System.ComponentModel.DataAnnotations;

namespace BenchPilot.Core.Models
{
    public class Match
    {
        public int Id { get; set; }
        
        [Required]
        public int JobId { get; set; }
        
        [Required]
        public int ConsultantId { get; set; }
        
        [Range(0, 100)]
        public int MatchScore { get; set; }
        
        [Range(0, 100)]
        public int SkillsMatch { get; set; }
        
        [Range(0, 100)]
        public int ExperienceMatch { get; set; }
        
        [Range(0, 100)]
        public int LocationMatch { get; set; }
        
        [Range(0, 100)]
        public int RateMatch { get; set; }
        
        public string Explanation { get; set; } = string.Empty;
        
        public List<string> KeyStrengths { get; set; } = new();
        
        public List<string> Concerns { get; set; } = new();
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public virtual JobRequirement Job { get; set; } = null!;
        public virtual Consultant Consultant { get; set; } = null!;
    }
}