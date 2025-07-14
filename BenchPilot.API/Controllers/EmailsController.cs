using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BenchPilot.Core.Models;
using BenchPilot.Infrastructure.Data;

namespace BenchPilot.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EmailsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Email>>> GetEmails(
            [FromQuery] string? status = null,
            [FromQuery] string? category = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = _context.Emails.AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(e => e.Status == status);
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(e => e.Category == category);
            }

            var emails = await query
                .OrderByDescending(e => e.Timestamp)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(emails);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Email>> GetEmail(int id)
        {
            var email = await _context.Emails
                .Include(e => e.RelatedJob)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (email == null)
                return NotFound();

            return Ok(email);
        }

        [HttpPost("{id}/process")]
        public async Task<ActionResult<object>> ProcessEmail(int id)
        {
            var email = await _context.Emails.FindAsync(id);
            if (email == null)
                return NotFound();

            // Simulate AI processing
            await Task.Delay(3000);

            var extractedData = new
            {
                JobTitle = new { Value = "Senior React Developer", Confidence = 95 },
                Skills = new[] { "React", "TypeScript", "Node.js", "AWS" },
                Experience = new { Value = 5, Confidence = 90 },
                Location = new { Value = "Remote", Confidence = 100 },
                PayRate = new { Value = "$80-100/hour", Confidence = 85 },
                RateType = "Hourly",
                ClientName = new { Value = "TechCorp Inc.", Confidence = 95 },
                VendorContact = new { Value = "Sarah Johnson", Confidence = 100 },
                VendorEmail = new { Value = email.From, Confidence = 100 },
                Urgency = "High",
                Description = email.Body,
                OverallConfidence = 92
            };

            // Update email status
            email.Status = "processed";
            email.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(extractedData);
        }

        [HttpPost("{id}/save-job")]
        public async Task<ActionResult<JobRequirement>> SaveExtractedJob(int id, [FromBody] JobRequirement jobData)
        {
            var email = await _context.Emails.FindAsync(id);
            if (email == null)
                return NotFound();

            jobData.CreatedDate = DateTime.UtcNow;
            jobData.UpdatedDate = DateTime.UtcNow;
            jobData.Source = "email_extraction";

            _context.JobRequirements.Add(jobData);

            // Link email to job
            email.RelatedJobId = jobData.Id;
            email.Status = "processed";
            email.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetJobRequirement", "JobRequirements", new { id = jobData.Id }, jobData);
        }

        [HttpPost("bulk-process")]
        public async Task<ActionResult<object>> BulkProcessEmails([FromBody] List<int> emailIds)
        {
            var emails = await _context.Emails
                .Where(e => emailIds.Contains(e.Id))
                .ToListAsync();

            var results = new List<object>();

            foreach (var email in emails)
            {
                // Simulate processing
                await Task.Delay(1000);

                email.Status = "processed";
                email.UpdatedAt = DateTime.UtcNow;

                results.Add(new
                {
                    EmailId = email.Id,
                    Status = "processed",
                    Confidence = 85
                });
            }

            await _context.SaveChangesAsync();

            return Ok(new { ProcessedCount = results.Count, Results = results });
        }

        [HttpPut("{id}/mark-read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var email = await _context.Emails.FindAsync(id);
            if (email == null)
                return NotFound();

            email.IsRead = true;
            email.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetEmailStats()
        {
            var stats = new
            {
                Total = await _context.Emails.CountAsync(),
                New = await _context.Emails.CountAsync(e => e.Status == "new"),
                Processed = await _context.Emails.CountAsync(e => e.Status == "processed"),
                ReviewNeeded = await _context.Emails.CountAsync(e => e.Status == "review_needed"),
                Spam = await _context.Emails.CountAsync(e => e.Status == "spam"),
                AutoEligible = await _context.Emails.CountAsync(e => 
                    e.Status == "new" && 
                    e.AiConfidence >= 90 && 
                    e.Category == "job_requirement")
            };

            return Ok(stats);
        }
    }
}