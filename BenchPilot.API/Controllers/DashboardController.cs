using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BenchPilot.Infrastructure.Data;

namespace BenchPilot.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetDashboardStats()
        {
            var stats = new
            {
                NewEmails = await _context.Emails.CountAsync(e => e.Status == "new"),
                ActiveConsultants = await _context.Consultants.CountAsync(c => c.IsActive),
                JobRequirements = await _context.JobRequirements.CountAsync(j => j.Status == "active"),
                SubmissionsToday = await _context.Submissions.CountAsync(s => s.SentAt.Date == DateTime.Today)
            };

            return Ok(stats);
        }

        [HttpGet("recent-activity")]
        public async Task<ActionResult<object>> GetRecentActivity()
        {
            var activities = new List<object>();

            // Recent emails
            var recentEmails = await _context.Emails
                .Where(e => e.Status == "new")
                .OrderByDescending(e => e.Timestamp)
                .Take(5)
                .Select(e => new
                {
                    Id = e.Id,
                    Type = "email",
                    Message = $"New job requirement received from {e.FromName}",
                    Time = e.Timestamp,
                    Status = "new"
                })
                .ToListAsync();

            activities.AddRange(recentEmails);

            // Recent matches
            var recentMatches = await _context.Matches
                .Include(m => m.Job)
                .Include(m => m.Consultant)
                .OrderByDescending(m => m.CreatedAt)
                .Take(3)
                .Select(m => new
                {
                    Id = m.Id,
                    Type = "match",
                    Message = $"AI found {m.MatchScore}% match for {m.Job.Title}",
                    Time = m.CreatedAt,
                    Status = "success"
                })
                .ToListAsync();

            activities.AddRange(recentMatches);

            // Recent submissions
            var recentSubmissions = await _context.Submissions
                .Include(s => s.Consultant)
                .Include(s => s.Job)
                .OrderByDescending(s => s.SentAt)
                .Take(3)
                .Select(s => new
                {
                    Id = s.Id,
                    Type = "submission",
                    Message = $"Resume submitted for {s.Consultant.Name} to {s.Job.Client}",
                    Time = s.SentAt,
                    Status = "pending"
                })
                .ToListAsync();

            activities.AddRange(recentSubmissions);

            return Ok(activities.OrderByDescending(a => a.Time).Take(10));
        }

        [HttpGet("top-matches")]
        public async Task<ActionResult<object>> GetTopMatches()
        {
            var topMatches = await _context.Matches
                .Include(m => m.Consultant)
                .Include(m => m.Job)
                .Where(m => m.IsActive)
                .OrderByDescending(m => m.MatchScore)
                .Take(5)
                .Select(m => new
                {
                    Consultant = m.Consultant.Name,
                    Job = m.Job.Title,
                    Match = m.MatchScore,
                    Skills = m.Consultant.Skills.Take(3),
                    Rate = $"${m.Consultant.Rate}/hr"
                })
                .ToListAsync();

            return Ok(topMatches);
        }
    }
}