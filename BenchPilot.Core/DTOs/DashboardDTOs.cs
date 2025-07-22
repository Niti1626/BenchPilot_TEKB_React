namespace BenchPilot.Core.DTOs
{
    public class SuperAdminDashboardStats
    {
        public int TotalRecruiters { get; set; }
        public int TotalAdmins { get; set; }
        public int TotalTeams { get; set; }
        public int TotalConsultants { get; set; }
        public int SubmissionsToday { get; set; }
        public int SubmissionsThisWeek { get; set; }
        public int SubmissionsThisMonth { get; set; }
        public double AvgAiAccuracy { get; set; }
        public int InactiveUsers { get; set; }
    }
    
    public class TeamAdminDashboardStats
    {
        public int TeamRecruiters { get; set; }
        public int TeamConsultants { get; set; }
        public int SubmissionsToday { get; set; }
        public int SubmissionsThisWeek { get; set; }
        public double TeamAiAccuracy { get; set; }
        public int IdleConsultants { get; set; }
    }
    
    public class RecruiterDashboardStats
    {
        public int MyConsultants { get; set; }
        public int SubmissionsToday { get; set; }
        public int SubmissionsThisWeek { get; set; }
        public int NewEmails { get; set; }
        public int PendingMatches { get; set; }
        public int IdleConsultants { get; set; }
    }
    
    public class TeamOverview
    {
        public int TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string AdminName { get; set; } = string.Empty;
        public int RecruiterCount { get; set; }
        public int SubmissionsToday { get; set; }
        public int SubmissionsThisWeek { get; set; }
        public double TeamAiAccuracy { get; set; }
        public bool IsActive { get; set; }
    }
    
    public class RecruiterPerformance
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int ActiveConsultants { get; set; }
        public int SubmissionsThisWeek { get; set; }
        public double SuccessRate { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; }
    }
    
    public class RecentActivity
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty; // email, match, submission, alert
        public string Message { get; set; } = string.Empty;
        public DateTime Time { get; set; }
        public string Status { get; set; } = string.Empty; // new, success, warning, error
        public string? UserName { get; set; }
        public string? TeamName { get; set; }
    }
    
    public class TopMatch
    {
        public string ConsultantName { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public int MatchScore { get; set; }
        public List<string> Skills { get; set; } = new();
        public string Rate { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
    
    public class SystemAlert
    {
        public int Id { get; set; }
        public string AlertType { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string? UserName { get; set; }
        public string? TeamName { get; set; }
        public bool IsResolved { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
    }
    
    public class QuotaStatus
    {
        public string FeatureName { get; set; } = string.Empty;
        public int Used { get; set; }
        public int Limit { get; set; }
        public double PercentageUsed { get; set; }
        public bool IsLimitReached { get; set; }
        public string DisplayText { get; set; } = string.Empty;
    }
}