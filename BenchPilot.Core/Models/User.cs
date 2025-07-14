using Microsoft.AspNetCore.Identity;

namespace BenchPilot.Core.Models
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        public string? ProfilePicture { get; set; }
        public string? Department { get; set; }
        public string? Role { get; set; }
    }
}