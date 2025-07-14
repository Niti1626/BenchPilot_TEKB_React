using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BenchPilot.Core.Models;
using BenchPilot.Infrastructure.Data;

namespace BenchPilot.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MatchingController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("jobs/{jobId}/matches")]
        public async Task<ActionResult<IEnumerable<Match>>> GetJobMatches(
            int jobId, 
            [FromQuery] int minScore = 60)
        {
            var matches = await _context.Matches
                .Include(m => m.Consultant)
                .Include(m => m.Job)
                .Where(m => m.JobId == jobId && m.MatchScore >= minScore && m.IsActive)
                .OrderByDescending(m => m.MatchScore)
                .ToListAsync();

            return Ok(matches);
        }

        [HttpPost("run-ai-analysis")]
        public async Task<ActionResult<object>> RunAiAnalysis([FromBody] AnalysisRequest request)
        {
            // Simulate AI analysis
            await Task.Delay(2000);

            var job = await _context.JobRequirements.FindAsync(request.JobId);
            var consultants = await _context.Consultants
                .Where(c => c.IsActive)
                .ToListAsync();

            var matches = new List<Match>();

            foreach (var consultant in consultants)
            {
                var match = CalculateMatch(job!, consultant);
                if (match.MatchScore >= request.MinThreshold)
                {
                    matches.Add(match);
                }
            }

            // Save matches to database
            _context.Matches.AddRange(matches);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                JobId = request.JobId,
                MatchesFound = matches.Count,
                Matches = matches.OrderByDescending(m => m.MatchScore).Take(10)
            });
        }

        [HttpPost("create-submission")]
        public async Task<ActionResult<Submission>> CreateSubmission([FromBody] CreateSubmissionRequest request)
        {
            var submission = new Submission
            {
                JobId = request.JobId,
                ConsultantId = request.ConsultantId,
                ToEmail = request.ToEmail,
                CcEmail = request.CcEmail,
                Subject = request.Subject,
                Body = request.Body,
                IsHighPriority = request.IsHighPriority,
                ScheduledSendTime = request.ScheduledSendTime,
                Status = "sent",
                SentAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Submissions.Add(submission);

            // Update counts
            var job = await _context.JobRequirements.FindAsync(request.JobId);
            var consultant = await _context.Consultants.FindAsync(request.ConsultantId);

            if (job != null)
            {
                job.SubmissionsCount++;
            }

            if (consultant != null)
            {
                consultant.TotalSubmissions++;
                consultant.LastSubmitted = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubmission", "Submissions", new { id = submission.Id }, submission);
        }

        private Match CalculateMatch(JobRequirement job, Consultant consultant)
        {
            // Simulate AI matching algorithm
            var skillsMatch = CalculateSkillsMatch(job.Skills, consultant.Skills);
            var experienceMatch = CalculateExperienceMatch(job.Experience, consultant.Experience);
            var locationMatch = CalculateLocationMatch(job.Location, consultant.Location);
            var rateMatch = CalculateRateMatch(job.Rate, consultant.Rate);

            var overallMatch = (int)((skillsMatch * 0.4) + (experienceMatch * 0.3) + (locationMatch * 0.2) + (rateMatch * 0.1));

            var keyStrengths = new List<string>();
            var concerns = new List<string>();

            if (skillsMatch >= 80) keyStrengths.Add("Strong skill alignment");
            if (experienceMatch >= 90) keyStrengths.Add("Excellent experience level");
            if (locationMatch == 100) keyStrengths.Add("Perfect location match");
            if (rateMatch >= 85) keyStrengths.Add("Rate within budget");

            if (skillsMatch < 70) concerns.Add("Some skill gaps identified");
            if (experienceMatch < 80) concerns.Add("Experience level concerns");
            if (locationMatch < 50) concerns.Add("Location mismatch");

            return new Match
            {
                JobId = job.Id,
                ConsultantId = consultant.Id,
                MatchScore = overallMatch,
                SkillsMatch = skillsMatch,
                ExperienceMatch = experienceMatch,
                LocationMatch = locationMatch,
                RateMatch = rateMatch,
                Explanation = GenerateExplanation(overallMatch, skillsMatch, experienceMatch),
                KeyStrengths = keyStrengths,
                Concerns = concerns,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };
        }

        private int CalculateSkillsMatch(List<string> jobSkills, List<string> consultantSkills)
        {
            if (!jobSkills.Any()) return 100;

            var matchingSkills = jobSkills.Intersect(consultantSkills, StringComparer.OrdinalIgnoreCase).Count();
            return (int)((double)matchingSkills / jobSkills.Count * 100);
        }

        private int CalculateExperienceMatch(int requiredExp, int consultantExp)
        {
            if (consultantExp >= requiredExp)
                return Math.Min(100, 80 + (consultantExp - requiredExp) * 5);
            else
                return Math.Max(0, 80 - (requiredExp - consultantExp) * 15);
        }

        private int CalculateLocationMatch(string jobLocation, string consultantLocation)
        {
            if (jobLocation.Contains("Remote", StringComparison.OrdinalIgnoreCase))
                return 100;
            
            return jobLocation.Equals(consultantLocation, StringComparison.OrdinalIgnoreCase) ? 100 : 50;
        }

        private int CalculateRateMatch(string jobRate, decimal consultantRate)
        {
            // Simple rate matching logic
            if (jobRate.Contains("$80-100") && consultantRate >= 80 && consultantRate <= 100)
                return 95;
            
            return 75; // Default rate match
        }

        private string GenerateExplanation(int overallMatch, int skillsMatch, int experienceMatch)
        {
            if (overallMatch >= 90)
                return "Excellent match with strong alignment across all criteria.";
            else if (overallMatch >= 80)
                return "Good match with most requirements met.";
            else if (overallMatch >= 70)
                return "Decent match but some gaps need consideration.";
            else
                return "Below threshold match with significant gaps.";
        }
    }

    public class AnalysisRequest
    {
        public int JobId { get; set; }
        public int MinThreshold { get; set; } = 60;
    }

    public class CreateSubmissionRequest
    {
        public int JobId { get; set; }
        public int ConsultantId { get; set; }
        public string ToEmail { get; set; } = string.Empty;
        public string? CcEmail { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public bool IsHighPriority { get; set; }
        public DateTime? ScheduledSendTime { get; set; }
    }
}