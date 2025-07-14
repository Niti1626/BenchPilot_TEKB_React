using System.ComponentModel.DataAnnotations;

namespace BenchPilot.Core.Models
{
    public class Email
    {
        public int Id { get; set; }
        
        [Required]
        [EmailAddress]
        public string From { get; set; } = string.Empty;
        
        [MaxLength(200)]
        public string FromName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string Subject { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string Preview { get; set; } = string.Empty;
        
        public string Body { get; set; } = string.Empty;
        
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        
        public bool IsRead { get; set; } = false;
        
        [MaxLength(20)]
        public string Status { get; set; } = "new";
        
        [MaxLength(10)]
        public string Priority { get; set; } = "Medium";
        
        [Range(0, 100)]
        public int? AiConfidence { get; set; }
        
        public bool HasAttachment { get; set; } = false;
        
        [MaxLength(50)]
        public string Category { get; set; } = "general";
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public string? AttachmentPath { get; set; }
        
        public string? ProcessingNotes { get; set; }
        
        public int? RelatedJobId { get; set; }
        
        // Navigation properties
        public virtual JobRequirement? RelatedJob { get; set; }
    }
}