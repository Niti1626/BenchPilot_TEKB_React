using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BenchPilot.Core.Models;
using BenchPilot.Infrastructure.Data;

namespace BenchPilot.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobRequirementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobRequirementsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobRequirement>>> GetJobRequirements(
            [FromQuery] string? search = null,
            [FromQuery] string? status = null,
            [FromQuery] string? client = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.JobRequirements.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(j => j.Title.Contains(search) || j.Client.Contains(search));
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(j => j.Status == status);
            }

            if (!string.IsNullOrEmpty(client))
            {
                query = query.Where(j => j.Client == client);
            }

            var jobs = await query
                .OrderByDescending(j => j.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(jobs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<JobRequirement>> GetJobRequirement(int id)
        {
            var job = await _context.JobRequirements
                .Include(j => j.Submissions)
                .Include(j => j.Matches)
                .Include(j => j.RelatedEmails)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
                return NotFound();

            return Ok(job);
        }

        [HttpPost]
        public async Task<ActionResult<JobRequirement>> CreateJobRequirement(JobRequirement jobRequirement)
        {
            jobRequirement.CreatedDate = DateTime.UtcNow;
            jobRequirement.UpdatedDate = DateTime.UtcNow;

            _context.JobRequirements.Add(jobRequirement);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobRequirement), new { id = jobRequirement.Id }, jobRequirement);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJobRequirement(int id, JobRequirement jobRequirement)
        {
            if (id != jobRequirement.Id)
                return BadRequest();

            jobRequirement.UpdatedDate = DateTime.UtcNow;
            _context.Entry(jobRequirement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JobRequirementExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJobRequirement(int id)
        {
            var job = await _context.JobRequirements.FindAsync(id);
            if (job == null)
                return NotFound();

            _context.JobRequirements.Remove(job);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("bulk-update")]
        public async Task<IActionResult> BulkUpdateJobRequirements([FromBody] BulkUpdateRequest request)
        {
            var jobs = await _context.JobRequirements
                .Where(j => request.JobIds.Contains(j.Id))
                .ToListAsync();

            foreach (var job in jobs)
            {
                if (!string.IsNullOrEmpty(request.Status))
                    job.Status = request.Status;
                
                if (!string.IsNullOrEmpty(request.RecruiterAssigned))
                    job.RecruiterAssigned = request.RecruiterAssigned;
                
                if (!string.IsNullOrEmpty(request.Priority))
                    job.Priority = request.Priority;

                job.UpdatedDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetJobStats()
        {
            var stats = new
            {
                Total = await _context.JobRequirements.CountAsync(),
                Active = await _context.JobRequirements.CountAsync(j => j.Status == "active"),
                Filled = await _context.JobRequirements.CountAsync(j => j.Status == "filled"),
                OnHold = await _context.JobRequirements.CountAsync(j => j.Status == "on_hold"),
                TotalSubmissions = await _context.Submissions.CountAsync(),
                AvgConfidence = await _context.JobRequirements
                    .Where(j => j.AiConfidence.HasValue)
                    .AverageAsync(j => j.AiConfidence.Value)
            };

            return Ok(stats);
        }

        private bool JobRequirementExists(int id)
        {
            return _context.JobRequirements.Any(e => e.Id == id);
        }
    }

    public class BulkUpdateRequest
    {
        public List<int> JobIds { get; set; } = new();
        public string? Status { get; set; }
        public string? RecruiterAssigned { get; set; }
        public string? Priority { get; set; }
    }
}