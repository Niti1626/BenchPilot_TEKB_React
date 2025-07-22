using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BenchPilot.Core.DTOs;
using BenchPilot.Infrastructure.Data;

namespace BenchPilot.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(ApplicationDbContext context, ILogger<DashboardController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetDashboardStats()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var teamId = User.FindFirst("TeamId")?.Value;

                switch (userRole)
                {
                    case "SuperAdmin":
                        return Ok(await GetSuperAdminStats());
                    
                    case "TeamAdmin":
                        if (int.TryParse(teamId, out var adminTeamId))
                            return Ok(await GetTeamAdminStats(adminTeamId));
                        break;
                    
                    case "Recruiter":
                        return Ok(await GetRecruiterStats(userId));
                }

                return BadRequest("Invalid user role or missing team information");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard stats");
                return StatusCode(500, "An error occurred while fetching dashboard stats");
            }
        }

        [HttpGet("recent-activity")]
        public async Task<ActionResult<List<RecentActivity>>> GetRecentActivity()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var teamId = User.FindFirst("TeamId")?.Value;

                var activities = new List<RecentActivity>();

                switch (userRole)
                {
                    case "SuperAdmin":
                        activities = await GetSuperAdminActivity();
                        break;
                    
                    case "TeamAdmin":
                        if (int.TryParse(teamId, out var adminTeamId))
                            activities = await GetTeamAdminActivity(adminTeamId);
                        break;
                    
                    case "Recruiter":
                        activities = await GetRecruiterActivity(userId);
                        break;
                }

                return Ok(activities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recent activity");
                return StatusCode(500, "An error occurred while fetching recent activity");
            }
        }

        [HttpGet("top-matches")]
        public async Task<ActionResult<List<TopMatch>>> GetTopMatches()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var teamId = User.FindFirst("TeamId")?.Value;

                var matches = new List<TopMatch>();

                switch (userRole)
                {
                    case "SuperAdmin":
                        matches = await GetSuperAdminTopMatches();
                        break;
                    
                    case "TeamAdmin":
                        if (int.TryParse(teamId, out var adminTeamId))
                            matches = await GetTeamAdminTopMatches(adminTeamId);
                        break;
                    
                    case "Recruiter":
                        matches = await GetRecruiterTopMatches(userId);
                        break;
                }

                return Ok(matches);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting top matches");
                return StatusCode(500, "An error occurred while fetching top matches");
            }
        }

        [HttpGet("team-overview")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<List<TeamOverview>>> GetTeamOverview()
        {
            try
            {
                var teams = await _context.Teams
                    .Where(t => t.IsActive)
                    .Select(t => new TeamOverview
                    {
                        TeamId = t.Id,
                        TeamName = t.TeamName,
                        AdminName = t.Users.Where(u => u.RoleId == 2).Select(u => u.FullName).FirstOrDefault() ?? "No Admin",
                        RecruiterCount = t.Users.Count(u => u.RoleId == 3 && u.IsActive),
                        SubmissionsToday = t.Submissions.Count(s => s.SentAt.Date == DateTime.UtcNow.Date),
                        SubmissionsThisWeek = t.Submissions.Count(s => s.SentAt >= DateTime.UtcNow.AddDays(-7)),
                        TeamAiAccuracy = t.JobRequirements.Where(j => j.AiConfidence.HasValue).Average(j => j.AiConfidence) ?? 0,
                        IsActive = t.IsActive
                    })
                    .ToListAsync();

                return Ok(teams);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting team overview");
                return StatusCode(500, "An error occurred while fetching team overview");
            }
        }

        [HttpGet("recruiter-performance")]
        [Authorize(Roles = "SuperAdmin,TeamAdmin")]
        public async Task<ActionResult<List<RecruiterPerformance>>> GetRecruiterPerformance()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var teamId = User.FindFirst("TeamId")?.Value;

                var query = _context.Users.Where(u => u.RoleId == 3 && u.IsActive);

                // Team Admin can only see their team's recruiters
                if (userRole == "TeamAdmin" && int.TryParse(teamId, out var adminTeamId))
                {
                    query = query.Where(u => u.TeamId == adminTeamId);
                }

                var recruiters = await query
                    .Select(u => new RecruiterPerformance
                    {
                        UserId = u.Id,
                        Name = u.FullName,
                        Email = u.Email,
                        ActiveConsultants = u.Consultants.Count(c => c.IsActive),
                        SubmissionsThisWeek = u.Submissions.Count(s => s.SentAt >= DateTime.UtcNow.AddDays(-7)),
                        SuccessRate = u.Submissions.Any() ? 
                            (double)u.Submissions.Count(s => s.ResponseReceived) / u.Submissions.Count() * 100 : 0,
                        LastLoginAt = u.LastLoginAt,
                        IsActive = u.IsActive
                    })
                    .OrderByDescending(r => r.SubmissionsThisWeek)
                    .ToListAsync();

                return Ok(recruiters);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recruiter performance");
                return StatusCode(500, "An error occurred while fetching recruiter performance");
            }
        }

        [HttpGet("system-alerts")]
        [Authorize(Roles = "SuperAdmin,TeamAdmin")]
        public async Task<ActionResult<List<SystemAlert>>> GetSystemAlerts()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var teamId = User.FindFirst("TeamId")?.Value;

                var query = _context.SystemAlerts.Where(a => !a.IsResolved);

                // Team Admin can only see their team's alerts
                if (userRole == "TeamAdmin" && int.TryParse(teamId, out var adminTeamId))
                {
                    query = query.Where(a => a.TeamId == adminTeamId || a.TeamId == null);
                }

                var alerts = await query
                    .Include(a => a.User)
                    .Include(a => a.Team)
                    .Select(a => new SystemAlert
                    {
                        Id = a.Id,
                        AlertType = a.AlertType,
                        Title = a.Title,
                        Message = a.Message,
                        Severity = a.Severity,
                        UserName = a.User != null ? a.User.FullName : null,
                        TeamName = a.Team != null ? a.Team.TeamName : null,
                        IsResolved = a.IsResolved,
                        CreatedAt = a.CreatedAt,
                        ResolvedAt = a.ResolvedAt
                    })
                    .OrderByDescending(a => a.CreatedAt)
                    .Take(10)
                    .ToListAsync();

                return Ok(alerts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system alerts");
                return StatusCode(500, "An error occurred while fetching system alerts");
            }
        }

        [HttpGet("quota-status")]
        [Authorize(Roles = "Recruiter")]
        public async Task<ActionResult<List<QuotaStatus>>> GetQuotaStatus()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                
                var userLimit = await _context.UserLimits.FirstOrDefaultAsync(ul => ul.UserId == userId);
                if (userLimit == null)
                {
                    return NotFound("User limits not found");
                }

                var currentResumes = await _context.Consultants.CountAsync(c => c.UserId == userId && c.IsActive);
                var todaySubmissions = await _context.Submissions.CountAsync(s => s.UserId == userId && s.SentAt.Date == DateTime.UtcNow.Date);

                var quotas = new List<QuotaStatus>
                {
                    new QuotaStatus
                    {
                        FeatureName = "Resumes",
                        Used = currentResumes,
                        Limit = userLimit.MaxResumes,
                        PercentageUsed = (double)currentResumes / userLimit.MaxResumes * 100,
                        IsLimitReached = currentResumes >= userLimit.MaxResumes,
                        DisplayText = $"{currentResumes}/{userLimit.MaxResumes} Resumes Used"
                    },
                    new QuotaStatus
                    {
                        FeatureName = "Daily Submissions",
                        Used = todaySubmissions,
                        Limit = userLimit.MaxSubmissionsPerDay,
                        PercentageUsed = (double)todaySubmissions / userLimit.MaxSubmissionsPerDay * 100,
                        IsLimitReached = todaySubmissions >= userLimit.MaxSubmissionsPerDay,
                        DisplayText = $"{todaySubmissions}/{userLimit.MaxSubmissionsPerDay} Submissions Today"
                    }
                };

                return Ok(quotas);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting quota status");
                return StatusCode(500, "An error occurred while fetching quota status");
            }
        }

        // Private helper methods
        private async Task<SuperAdminDashboardStats> GetSuperAdminStats()
        {
            return new SuperAdminDashboardStats
            {
                TotalRecruiters = await _context.Users.CountAsync(u => u.RoleId == 3 && u.IsActive),
                TotalAdmins = await _context.Users.CountAsync(u => u.RoleId == 2 && u.IsActive),
                TotalTeams = await _context.Teams.CountAsync(t => t.IsActive),
                TotalConsultants = await _context.Consultants.CountAsync(c => c.IsActive),
                SubmissionsToday = await _context.Submissions.CountAsync(s => s.SentAt.Date == DateTime.UtcNow.Date),
                SubmissionsThisWeek = await _context.Submissions.CountAsync(s => s.SentAt >= DateTime.UtcNow.AddDays(-7)),
                SubmissionsThisMonth = await _context.Submissions.CountAsync(s => s.SentAt >= DateTime.UtcNow.AddDays(-30)),
                AvgAiAccuracy = await _context.JobRequirements.Where(j => j.AiConfidence.HasValue).AverageAsync(j => j.AiConfidence) ?? 0,
                InactiveUsers = await _context.Users.CountAsync(u => u.LastLoginAt < DateTime.UtcNow.AddDays(-7) && u.IsActive)
            };
        }

        private async Task<TeamAdminDashboardStats> GetTeamAdminStats(int teamId)
        {
            return new TeamAdminDashboardStats
            {
                TeamRecruiters = await _context.Users.CountAsync(u => u.TeamId == teamId && u.RoleId == 3 && u.IsActive),
                TeamConsultants = await _context.Consultants.CountAsync(c => c.TeamId == teamId && c.IsActive),
                SubmissionsToday = await _context.Submissions.CountAsync(s => s.TeamId == teamId && s.SentAt.Date == DateTime.UtcNow.Date),
                SubmissionsThisWeek = await _context.Submissions.CountAsync(s => s.TeamId == teamId && s.SentAt >= DateTime.UtcNow.AddDays(-7)),
                TeamAiAccuracy = await _context.JobRequirements.Where(j => j.TeamId == teamId && j.AiConfidence.HasValue).AverageAsync(j => j.AiConfidence) ?? 0,
                IdleConsultants = await _context.Consultants.CountAsync(c => c.TeamId == teamId && c.LastSubmitted < DateTime.UtcNow.AddDays(-2) && c.IsActive)
            };
        }

        private async Task<RecruiterDashboardStats> GetRecruiterStats(int userId)
        {
            return new RecruiterDashboardStats
            {
                MyConsultants = await _context.Consultants.CountAsync(c => c.UserId == userId && c.IsActive),
                SubmissionsToday = await _context.Submissions.CountAsync(s => s.UserId == userId && s.SentAt.Date == DateTime.UtcNow.Date),
                SubmissionsThisWeek = await _context.Submissions.CountAsync(s => s.UserId == userId && s.SentAt >= DateTime.UtcNow.AddDays(-7)),
                NewEmails = await _context.Emails.CountAsync(e => e.UserId == userId && e.Status == "new"),
                PendingMatches = await _context.Matches.CountAsync(m => m.UserId == userId && m.IsActive),
                IdleConsultants = await _context.Consultants.CountAsync(c => c.UserId == userId && c.LastSubmitted < DateTime.UtcNow.AddDays(-1) && c.IsActive)
            };
        }

        private async Task<List<RecentActivity>> GetSuperAdminActivity()
        {
            var activities = new List<RecentActivity>();

            // Recent user signups
            var recentSignups = await _context.UserActivities
                .Where(a => a.ActivityType == "signup")
                .Include(a => a.User)
                .OrderByDescending(a => a.CreatedAt)
                .Take(5)
                .Select(a => new RecentActivity
                {
                    Id = a.Id,
                    Type = "signup",
                    Message = $"New recruiter {a.User.FullName} signed up",
                    Time = a.CreatedAt,
                    Status = "new",
                    UserName = a.User.FullName
                })
                .ToListAsync();

            activities.AddRange(recentSignups);

            // Recent submissions
            var recentSubmissions = await _context.Submissions
                .Include(s => s.User)
                .Include(s => s.Consultant)
                .Include(s => s.Job)
                .OrderByDescending(s => s.SentAt)
                .Take(5)
                .Select(s => new RecentActivity
                {
                    Id = s.Id,
                    Type = "submission",
                    Message = $"{s.User.FullName} submitted {s.Consultant.Name} for {s.Job.Title}",
                    Time = s.SentAt,
                    Status = "success",
                    UserName = s.User.FullName
                })
                .ToListAsync();

            activities.AddRange(recentSubmissions);

            return activities.OrderByDescending(a => a.Time).Take(10).ToList();
        }

        private async Task<List<RecentActivity>> GetTeamAdminActivity(int teamId)
        {
            var activities = new List<RecentActivity>();

            // Team submissions
            var recentSubmissions = await _context.Submissions
                .Where(s => s.TeamId == teamId)
                .Include(s => s.User)
                .Include(s => s.Consultant)
                .Include(s => s.Job)
                .OrderByDescending(s => s.SentAt)
                .Take(10)
                .Select(s => new RecentActivity
                {
                    Id = s.Id,
                    Type = "submission",
                    Message = $"{s.User.FullName} submitted {s.Consultant.Name} for {s.Job.Title}",
                    Time = s.SentAt,
                    Status = "success",
                    UserName = s.User.FullName
                })
                .ToListAsync();

            activities.AddRange(recentSubmissions);

            return activities.OrderByDescending(a => a.Time).Take(10).ToList();
        }

        private async Task<List<RecentActivity>> GetRecruiterActivity(int userId)
        {
            var activities = new List<RecentActivity>();

            // My submissions
            var mySubmissions = await _context.Submissions
                .Where(s => s.UserId == userId)
                .Include(s => s.Consultant)
                .Include(s => s.Job)
                .OrderByDescending(s => s.SentAt)
                .Take(5)
                .Select(s => new RecentActivity
                {
                    Id = s.Id,
                    Type = "submission",
                    Message = $"Submitted {s.Consultant.Name} for {s.Job.Title}",
                    Time = s.SentAt,
                    Status = s.ResponseReceived ? "success" : "pending"
                })
                .ToListAsync();

            activities.AddRange(mySubmissions);

            // My new emails
            var newEmails = await _context.Emails
                .Where(e => e.UserId == userId && e.Status == "new")
                .OrderByDescending(e => e.Timestamp)
                .Take(5)
                .Select(e => new RecentActivity
                {
                    Id = e.Id,
                    Type = "email",
                    Message = $"New job requirement: {e.Subject}",
                    Time = e.Timestamp,
                    Status = "new"
                })
                .ToListAsync();

            activities.AddRange(newEmails);

            return activities.OrderByDescending(a => a.Time).Take(10).ToList();
        }

        private async Task<List<TopMatch>> GetSuperAdminTopMatches()
        {
            return await _context.Matches
                .Where(m => m.IsActive)
                .Include(m => m.Consultant)
                .Include(m => m.Job)
                .OrderByDescending(m => m.MatchScore)
                .Take(5)
                .Select(m => new TopMatch
                {
                    ConsultantName = m.Consultant.Name,
                    JobTitle = m.Job.Title,
                    MatchScore = m.MatchScore,
                    Skills = System.Text.Json.JsonSerializer.Deserialize<List<string>>(m.Consultant.Skills) ?? new List<string>(),
                    Rate = $"${m.Consultant.Rate}/hr",
                    Location = m.Consultant.Location,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();
        }

        private async Task<List<TopMatch>> GetTeamAdminTopMatches(int teamId)
        {
            return await _context.Matches
                .Where(m => m.TeamId == teamId && m.IsActive)
                .Include(m => m.Consultant)
                .Include(m => m.Job)
                .OrderByDescending(m => m.MatchScore)
                .Take(5)
                .Select(m => new TopMatch
                {
                    ConsultantName = m.Consultant.Name,
                    JobTitle = m.Job.Title,
                    MatchScore = m.MatchScore,
                    Skills = System.Text.Json.JsonSerializer.Deserialize<List<string>>(m.Consultant.Skills) ?? new List<string>(),
                    Rate = $"${m.Consultant.Rate}/hr",
                    Location = m.Consultant.Location,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();
        }

        private async Task<List<TopMatch>> GetRecruiterTopMatches(int userId)
        {
            return await _context.Matches
                .Where(m => m.UserId == userId && m.IsActive)
                .Include(m => m.Consultant)
                .Include(m => m.Job)
                .OrderByDescending(m => m.MatchScore)
                .Take(5)
                .Select(m => new TopMatch
                {
                    ConsultantName = m.Consultant.Name,
                    JobTitle = m.Job.Title,
                    MatchScore = m.MatchScore,
                    Skills = System.Text.Json.JsonSerializer.Deserialize<List<string>>(m.Consultant.Skills) ?? new List<string>(),
                    Rate = $"${m.Consultant.Rate}/hr",
                    Location = m.Consultant.Location,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();
        }
    }
}