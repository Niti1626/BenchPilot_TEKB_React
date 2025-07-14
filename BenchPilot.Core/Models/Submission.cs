using System.ComponentModel.DataAnnotations;

namespace BenchPilot.Core.Models
{
    public class Submission
    {
        public int Id { get; set; }
        
        [Required]
        public int JobId { get; set; }
        
        [Required]
        public int ConsultantId { get; set; }
        
        [Required]
        [EmailAddress]
        public string ToEmail { get; set; } = string.Empty;
        
        [EmailAddress]
        public string? CcEmail { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Subject { get; set; } = string.Empty;
        
        [Required]
        public string Body { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string Status { get; set; } = "sent";
        
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        
        public bool IsHighPriority { get; set; } = false;
        
        public DateTime? ScheduledSendTime { get; set; }
        
        public string? AttachmentPath { get; set; }
        
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual JobRequirement Job { get; set; } = null!;
        public virtual Consultant Consultant { get; set; } = null!;
    }
}