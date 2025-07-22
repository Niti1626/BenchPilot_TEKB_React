using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BenchPilot.Core.Models;
using BenchPilot.Core.DTOs;
using BenchPilot.Infrastructure.Data;

namespace BenchPilot.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ApplicationDbContext context, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("signup")]
        public async Task<ActionResult<AuthResponse>> SignUp([FromBody] SignUpRequest request)
        {
            try
            {
                // Validate request
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid input data",
                        Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()
                    });
                }

                // Check if email already exists
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());
                if (existingUser != null)
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Email already exists",
                        Errors = new List<string> { "An account with this email already exists" }
                    });
                }

                // Get default trial team
                var trialTeam = await _context.Teams.FirstOrDefaultAsync(t => t.TeamName == "Trial Team");
                if (trialTeam == null)
                {
                    return StatusCode(500, new AuthResponse
                    {
                        Success = false,
                        Message = "System configuration error",
                        Errors = new List<string> { "Default trial team not found" }
                    });
                }

                // Get recruiter role
                var recruiterRole = await _context.UserRoles.FirstOrDefaultAsync(r => r.RoleName == "Recruiter");
                if (recruiterRole == null)
                {
                    return StatusCode(500, new AuthResponse
                    {
                        Success = false,
                        Message = "System configuration error",
                        Errors = new List<string> { "Recruiter role not found" }
                    });
                }

                // Hash password
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                // Create user
                var user = new User
                {
                    FullName = request.FullName.Trim(),
                    Email = request.Email.ToLower().Trim(),
                    Phone = request.Phone?.Trim(),
                    PasswordHash = passwordHash,
                    RoleId = recruiterRole.Id,
                    TeamId = trialTeam.Id,
                    IsActive = true,
                    IsEmailConfirmed = false, // Will be confirmed via email
                    EmailConfirmationToken = GenerateRandomToken(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Create user limits for trial user
                var userLimit = new UserLimit
                {
                    UserId = user.Id,
                    MaxResumes = 2,
                    MaxSubmissionsPerDay = 10,
                    MaxAIMatches = 1,
                    MaxResumeEnhancements = 3,
                    MaxSubmissionHistory = 5,
                    IsTrialUser = true,
                    TrialExpiryDate = DateTime.UtcNow.AddDays(30),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.UserLimits.Add(userLimit);
                await _context.SaveChangesAsync();

                // Log activity
                var activity = new UserActivity
                {
                    UserId = user.Id,
                    ActivityType = "signup",
                    Description = "User signed up for free recruiter account",
                    IPAddress = GetClientIPAddress(),
                    UserAgent = Request.Headers["User-Agent"].ToString(),
                    CreatedAt = DateTime.UtcNow
                };

                _context.UserActivities.Add(activity);
                await _context.SaveChangesAsync();

                // TODO: Send welcome email with confirmation link
                // await SendWelcomeEmail(user);

                // Generate JWT token
                var token = GenerateJwtToken(user, recruiterRole.RoleName, trialTeam.TeamName);

                // Update last login
                user.LastLoginAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new AuthResponse
                {
                    Success = true,
                    Message = "Account created successfully! Welcome to BenchPilot!",
                    Token = token,
                    User = new UserInfo
                    {
                        Id = user.Id,
                        FullName = user.FullName,
                        Email = user.Email,
                        Phone = user.Phone,
                        Role = recruiterRole.RoleName,
                        RoleId = user.RoleId,
                        TeamName = trialTeam.TeamName,
                        TeamId = user.TeamId,
                        IsEmailConfirmed = user.IsEmailConfirmed,
                        LastLoginAt = user.LastLoginAt,
                        Limits = new UserLimitInfo
                        {
                            MaxResumes = userLimit.MaxResumes,
                            MaxSubmissionsPerDay = userLimit.MaxSubmissionsPerDay,
                            MaxAIMatches = userLimit.MaxAIMatches,
                            MaxResumeEnhancements = userLimit.MaxResumeEnhancements,
                            MaxSubmissionHistory = userLimit.MaxSubmissionHistory,
                            IsTrialUser = userLimit.IsTrialUser,
                            TrialExpiryDate = userLimit.TrialExpiryDate,
                            CurrentResumes = 0,
                            TodaySubmissions = 0
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user signup");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during signup",
                    Errors = new List<string> { "Please try again later" }
                });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid input data",
                        Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()
                    });
                }

                // Find user
                var user = await _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.Team)
                    .Include(u => u.UserLimit)
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

                if (user == null || !user.IsActive)
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid email or password",
                        Errors = new List<string> { "Please check your credentials and try again" }
                    });
                }

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid email or password",
                        Errors = new List<string> { "Please check your credentials and try again" }
                    });
                }

                // Generate JWT token
                var token = GenerateJwtToken(user, user.Role.RoleName, user.Team?.TeamName);

                // Update last login
                user.LastLoginAt = DateTime.UtcNow;
                user.UpdatedAt = DateTime.UtcNow;

                // Log activity
                var activity = new UserActivity
                {
                    UserId = user.Id,
                    ActivityType = "login",
                    Description = "User logged in",
                    IPAddress = GetClientIPAddress(),
                    UserAgent = Request.Headers["User-Agent"].ToString(),
                    CreatedAt = DateTime.UtcNow
                };

                _context.UserActivities.Add(activity);
                await _context.SaveChangesAsync();

                // Get current usage for limits
                var currentResumes = await _context.Consultants.CountAsync(c => c.UserId == user.Id && c.IsActive);
                var todaySubmissions = await _context.Submissions.CountAsync(s => s.UserId == user.Id && s.SentAt.Date == DateTime.UtcNow.Date);

                return Ok(new AuthResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Token = token,
                    User = new UserInfo
                    {
                        Id = user.Id,
                        FullName = user.FullName,
                        Email = user.Email,
                        Phone = user.Phone,
                        Role = user.Role.RoleName,
                        RoleId = user.RoleId,
                        TeamName = user.Team?.TeamName,
                        TeamId = user.TeamId,
                        IsEmailConfirmed = user.IsEmailConfirmed,
                        LastLoginAt = user.LastLoginAt,
                        Limits = user.UserLimit != null ? new UserLimitInfo
                        {
                            MaxResumes = user.UserLimit.MaxResumes,
                            MaxSubmissionsPerDay = user.UserLimit.MaxSubmissionsPerDay,
                            MaxAIMatches = user.UserLimit.MaxAIMatches,
                            MaxResumeEnhancements = user.UserLimit.MaxResumeEnhancements,
                            MaxSubmissionHistory = user.UserLimit.MaxSubmissionHistory,
                            IsTrialUser = user.UserLimit.IsTrialUser,
                            TrialExpiryDate = user.UserLimit.TrialExpiryDate,
                            CurrentResumes = currentResumes,
                            TodaySubmissions = todaySubmissions
                        } : null
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user login");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during login",
                    Errors = new List<string> { "Please try again later" }
                });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult<AuthResponse>> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());
                
                if (user != null && user.IsActive)
                {
                    // Generate reset token
                    user.PasswordResetToken = GenerateRandomToken();
                    user.PasswordResetExpiry = DateTime.UtcNow.AddHours(1); // Token expires in 1 hour
                    user.UpdatedAt = DateTime.UtcNow;
                    
                    await _context.SaveChangesAsync();
                    
                    // TODO: Send password reset email
                    // await SendPasswordResetEmail(user);
                }

                // Always return success to prevent email enumeration
                return Ok(new AuthResponse
                {
                    Success = true,
                    Message = "If an account with that email exists, a password reset link has been sent."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during forgot password");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred",
                    Errors = new List<string> { "Please try again later" }
                });
            }
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<AuthResponse>> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => 
                    u.Email.ToLower() == request.Email.ToLower() && 
                    u.PasswordResetToken == request.Token &&
                    u.PasswordResetExpiry > DateTime.UtcNow);

                if (user == null)
                {
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid or expired reset token",
                        Errors = new List<string> { "Please request a new password reset" }
                    });
                }

                // Update password
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                user.PasswordResetToken = null;
                user.PasswordResetExpiry = null;
                user.UpdatedAt = DateTime.UtcNow;

                // Log activity
                var activity = new UserActivity
                {
                    UserId = user.Id,
                    ActivityType = "password_reset",
                    Description = "User reset password",
                    IPAddress = GetClientIPAddress(),
                    UserAgent = Request.Headers["User-Agent"].ToString(),
                    CreatedAt = DateTime.UtcNow
                };

                _context.UserActivities.Add(activity);
                await _context.SaveChangesAsync();

                return Ok(new AuthResponse
                {
                    Success = true,
                    Message = "Password reset successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset");
                return StatusCode(500, new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred",
                    Errors = new List<string> { "Please try again later" }
                });
            }
        }

        private string GenerateJwtToken(User user, string roleName, string? teamName)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.FullName),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, roleName),
                new("RoleId", user.RoleId.ToString())
            };

            if (user.TeamId.HasValue && !string.IsNullOrEmpty(teamName))
            {
                claims.Add(new Claim("TeamId", user.TeamId.Value.ToString()));
                claims.Add(new Claim("TeamName", teamName));
            }

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["Jwt:ExpireDays"])),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRandomToken()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[32];
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        private string GetClientIPAddress()
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
            {
                ipAddress = Request.Headers["X-Forwarded-For"].FirstOrDefault();
            }
            return ipAddress ?? "Unknown";
        }
    }
}