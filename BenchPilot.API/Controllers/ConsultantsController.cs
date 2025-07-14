using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BenchPilot.Core.Models;
using BenchPilot.Infrastructure.Data;

namespace BenchPilot.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConsultantsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ConsultantsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Consultant>>> GetConsultants(
            [FromQuery] string? search = null,
            [FromQuery] string? skills = null,
            [FromQuery] string? availability = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.Consultants.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.Name.Contains(search) || c.Email.Contains(search));
            }

            if (!string.IsNullOrEmpty(skills))
            {
                query = query.Where(c => c.Skills.Any(s => s.Contains(skills)));
            }

            if (!string.IsNullOrEmpty(availability))
            {
                query = query.Where(c => c.Availability == availability);
            }

            var consultants = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(consultants);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Consultant>> GetConsultant(int id)
        {
            var consultant = await _context.Consultants
                .Include(c => c.Submissions)
                .Include(c => c.Matches)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (consultant == null)
                return NotFound();

            return Ok(consultant);
        }

        [HttpPost]
        public async Task<ActionResult<Consultant>> CreateConsultant(Consultant consultant)
        {
            consultant.CreatedAt = DateTime.UtcNow;
            consultant.UpdatedAt = DateTime.UtcNow;

            _context.Consultants.Add(consultant);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetConsultant), new { id = consultant.Id }, consultant);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateConsultant(int id, Consultant consultant)
        {
            if (id != consultant.Id)
                return BadRequest();

            consultant.UpdatedAt = DateTime.UtcNow;
            _context.Entry(consultant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConsultantExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsultant(int id)
        {
            var consultant = await _context.Consultants.FindAsync(id);
            if (consultant == null)
                return NotFound();

            _context.Consultants.Remove(consultant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("upload-resume")]
        public async Task<ActionResult<object>> UploadResume(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "resumes");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Simulate AI processing of resume
            await Task.Delay(2000);

            var extractedData = new
            {
                Name = "John Doe",
                Email = "john.doe@email.com",
                Phone = "+1 (555) 123-4567",
                Skills = new[] { "React", "JavaScript", "Node.js", "Python" },
                Experience = 5,
                Location = "New York, NY",
                FileName = fileName
            };

            return Ok(extractedData);
        }

        private bool ConsultantExists(int id)
        {
            return _context.Consultants.Any(e => e.Id == id);
        }
    }
}