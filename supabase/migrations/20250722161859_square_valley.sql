-- BenchPilot Database Schema for SQL Server
-- Multi-Role System: Super Admin, Team Admin, Recruiter

USE master;
GO

-- Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'BenchPilotDB')
BEGIN
    CREATE DATABASE BenchPilotDB;
END
GO

USE BenchPilotDB;
GO

-- =============================================
-- 1. USERS AND AUTHENTICATION TABLES
-- =============================================

-- User Roles Enum Table
CREATE TABLE UserRoles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(200),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Insert Default Roles
INSERT INTO UserRoles (RoleName, Description) VALUES 
('SuperAdmin', 'System-wide administrator with full access'),
('TeamAdmin', 'Team administrator managing recruiters'),
('Recruiter', 'Bench sales recruiter with limited access');

-- Teams Table
CREATE TABLE Teams (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TeamName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Insert Default Trial Team
INSERT INTO Teams (TeamName, Description) VALUES 
('Trial Team', 'Default team for free trial recruiters');

-- Users Table (Main Authentication)
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Phone NVARCHAR(20) NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    RoleId INT NOT NULL,
    TeamId INT NULL,
    IsActive BIT DEFAULT 1,
    IsEmailConfirmed BIT DEFAULT 0,
    EmailConfirmationToken NVARCHAR(255) NULL,
    PasswordResetToken NVARCHAR(255) NULL,
    PasswordResetExpiry DATETIME2 NULL,
    LastLoginAt DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_Users_Role FOREIGN KEY (RoleId) REFERENCES UserRoles(Id),
    CONSTRAINT FK_Users_Team FOREIGN KEY (TeamId) REFERENCES Teams(Id)
);

-- User Limits Table (For Free Plan Restrictions)
CREATE TABLE UserLimits (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    MaxResumes INT DEFAULT 2,
    MaxSubmissionsPerDay INT DEFAULT 10,
    MaxAIMatches INT DEFAULT 1,
    MaxResumeEnhancements INT DEFAULT 3,
    MaxSubmissionHistory INT DEFAULT 5,
    IsTrialUser BIT DEFAULT 1,
    TrialExpiryDate DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_UserLimits_User FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- =============================================
-- 2. CONSULTANT AND RESUME MANAGEMENT
-- =============================================

CREATE TABLE Consultants (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL, -- Recruiter who owns this consultant
    TeamId INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(20) NULL,
    Skills NVARCHAR(MAX) NULL, -- JSON array of skills
    Experience INT DEFAULT 0,
    Location NVARCHAR(200) NULL,
    Rate DECIMAL(10,2) DEFAULT 0,
    RateType NVARCHAR(20) DEFAULT 'Hourly', -- Hourly, Daily, Annual
    Availability NVARCHAR(50) DEFAULT 'Available', -- Available, On Project, Busy
    LastSubmitted DATETIME2 NULL,
    Rating DECIMAL(3,2) DEFAULT 0,
    TotalSubmissions INT DEFAULT 0,
    ResumeFileName NVARCHAR(255) NULL,
    ResumeFilePath NVARCHAR(500) NULL,
    Notes NVARCHAR(MAX) NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_Consultants_User FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT FK_Consultants_Team FOREIGN KEY (TeamId) REFERENCES Teams(Id)
);

-- =============================================
-- 3. JOB REQUIREMENTS AND EMAIL PROCESSING
-- =============================================

CREATE TABLE JobRequirements (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL, -- Recruiter who processed this job
    TeamId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Client NVARCHAR(100) NOT NULL,
    ClientContact NVARCHAR(100) NULL,
    ClientEmail NVARCHAR(255) NULL,
    ClientPhone NVARCHAR(20) NULL,
    Status NVARCHAR(20) DEFAULT 'active', -- active, on_hold, filled, cancelled, draft
    Priority NVARCHAR(10) DEFAULT 'Medium', -- High, Medium, Low
    Location NVARCHAR(100) NULL,
    JobType NVARCHAR(20) DEFAULT 'Contract', -- Contract, Full-time, Part-time, Temporary
    Duration NVARCHAR(50) NULL,
    Rate NVARCHAR(50) NULL,
    RateType NVARCHAR(20) DEFAULT 'Hourly',
    Experience INT DEFAULT 0,
    Skills NVARCHAR(MAX) NULL, -- JSON array
    Description NVARCHAR(MAX) NULL,
    Requirements NVARCHAR(MAX) NULL, -- JSON array
    NiceToHave NVARCHAR(MAX) NULL, -- JSON array
    Source NVARCHAR(50) DEFAULT 'manual_entry', -- email_extraction, manual_entry
    AiConfidence INT NULL, -- 0-100
    SubmissionsCount INT DEFAULT 0,
    MatchesCount INT DEFAULT 0,
    ViewsCount INT DEFAULT 0,
    RecruiterAssigned NVARCHAR(100) NULL,
    Urgency NVARCHAR(10) DEFAULT 'Medium',
    ClientRating DECIMAL(3,2) DEFAULT 0,
    Budget DECIMAL(12,2) DEFAULT 0,
    StartDate DATETIME2 NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_JobRequirements_User FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT FK_JobRequirements_Team FOREIGN KEY (TeamId) REFERENCES Teams(Id)
);

CREATE TABLE Emails (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL, -- Recruiter who owns this email
    TeamId INT NOT NULL,
    FromEmail NVARCHAR(255) NOT NULL,
    FromName NVARCHAR(200) NULL,
    Subject NVARCHAR(500) NOT NULL,
    Preview NVARCHAR(1000) NULL,
    Body NVARCHAR(MAX) NULL,
    Timestamp DATETIME2 DEFAULT GETUTCDATE(),
    IsRead BIT DEFAULT 0,
    Status NVARCHAR(20) DEFAULT 'new', -- new, processed, review_needed, spam, skipped
    Priority NVARCHAR(10) DEFAULT 'Medium',
    AiConfidence INT NULL,
    HasAttachment BIT DEFAULT 0,
    Category NVARCHAR(50) DEFAULT 'general', -- job_requirement, general, spam
    AttachmentPath NVARCHAR(500) NULL,
    ProcessingNotes NVARCHAR(MAX) NULL,
    RelatedJobId INT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_Emails_User FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT FK_Emails_Team FOREIGN KEY (TeamId) REFERENCES Teams(Id),
    CONSTRAINT FK_Emails_Job FOREIGN KEY (RelatedJobId) REFERENCES JobRequirements(Id)
);

-- =============================================
-- 4. AI MATCHING AND SUBMISSIONS
-- =============================================

CREATE TABLE Matches (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    JobId INT NOT NULL,
    ConsultantId INT NOT NULL,
    UserId INT NOT NULL, -- Recruiter
    TeamId INT NOT NULL,
    MatchScore INT NOT NULL, -- 0-100
    SkillsMatch INT NOT NULL,
    ExperienceMatch INT NOT NULL,
    LocationMatch INT NOT NULL,
    RateMatch INT NOT NULL,
    Explanation NVARCHAR(MAX) NULL,
    KeyStrengths NVARCHAR(MAX) NULL, -- JSON array
    Concerns NVARCHAR(MAX) NULL, -- JSON array
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_Matches_Job FOREIGN KEY (JobId) REFERENCES JobRequirements(Id),
    CONSTRAINT FK_Matches_Consultant FOREIGN KEY (ConsultantId) REFERENCES Consultants(Id),
    CONSTRAINT FK_Matches_User FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT FK_Matches_Team FOREIGN KEY (TeamId) REFERENCES Teams(Id)
);

CREATE TABLE Submissions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    JobId INT NOT NULL,
    ConsultantId INT NOT NULL,
    UserId INT NOT NULL, -- Recruiter who made submission
    TeamId INT NOT NULL,
    ToEmail NVARCHAR(255) NOT NULL,
    CcEmail NVARCHAR(255) NULL,
    Subject NVARCHAR(500) NOT NULL,
    Body NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(20) DEFAULT 'sent', -- sent, pending, failed, responded
    IsHighPriority BIT DEFAULT 0,
    ScheduledSendTime DATETIME2 NULL,
    SentAt DATETIME2 DEFAULT GETUTCDATE(),
    AttachmentPath NVARCHAR(500) NULL,
    Notes NVARCHAR(MAX) NULL,
    ResponseReceived BIT DEFAULT 0,
    ResponseDate DATETIME2 NULL,
    InterviewScheduled BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_Submissions_Job FOREIGN KEY (JobId) REFERENCES JobRequirements(Id),
    CONSTRAINT FK_Submissions_Consultant FOREIGN KEY (ConsultantId) REFERENCES Consultants(Id),
    CONSTRAINT FK_Submissions_User FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT FK_Submissions_Team FOREIGN KEY (TeamId) REFERENCES Teams(Id)
);

-- =============================================
-- 5. SYSTEM ANALYTICS AND TRACKING
-- =============================================

CREATE TABLE UserActivity (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ActivityType NVARCHAR(50) NOT NULL, -- login, logout, submission, email_process, etc.
    Description NVARCHAR(500) NULL,
    IPAddress NVARCHAR(45) NULL,
    UserAgent NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_UserActivity_User FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE SystemAlerts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AlertType NVARCHAR(50) NOT NULL, -- email_integration_failed, low_ai_accuracy, user_inactive
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(1000) NOT NULL,
    Severity NVARCHAR(20) DEFAULT 'Medium', -- High, Medium, Low
    UserId INT NULL, -- Specific user if applicable
    TeamId INT NULL, -- Specific team if applicable
    IsResolved BIT DEFAULT 0,
    ResolvedAt DATETIME2 NULL,
    ResolvedBy INT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_SystemAlerts_User FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT FK_SystemAlerts_Team FOREIGN KEY (TeamId) REFERENCES Teams(Id),
    CONSTRAINT FK_SystemAlerts_ResolvedBy FOREIGN KEY (ResolvedBy) REFERENCES Users(Id)
);

-- =============================================
-- 6. SAMPLE DATA FOR TESTING
-- =============================================

-- Create Super Admin User
INSERT INTO Users (FullName, Email, Phone, PasswordHash, RoleId, TeamId, IsActive, IsEmailConfirmed) 
VALUES ('Super Admin', 'admin@benchpilot.com', '+1-555-0001', 
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
        1, NULL, 1, 1);

-- Create Team Admin
INSERT INTO Users (FullName, Email, Phone, PasswordHash, RoleId, TeamId, IsActive, IsEmailConfirmed) 
VALUES ('Team Admin', 'teamadmin@benchpilot.com', '+1-555-0002', 
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
        2, 1, 1, 1);

-- Create Sample Recruiter
INSERT INTO Users (FullName, Email, Phone, PasswordHash, RoleId, TeamId, IsActive, IsEmailConfirmed) 
VALUES ('John Recruiter', 'recruiter@benchpilot.com', '+1-555-0003', 
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
        3, 1, 1, 1);

-- Set User Limits for Sample Recruiter
INSERT INTO UserLimits (UserId, MaxResumes, MaxSubmissionsPerDay, MaxAIMatches, MaxResumeEnhancements, MaxSubmissionHistory, IsTrialUser, TrialExpiryDate)
VALUES (3, 2, 10, 1, 3, 5, 1, DATEADD(DAY, 30, GETUTCDATE()));

-- Sample Consultants
INSERT INTO Consultants (UserId, TeamId, Name, Email, Phone, Skills, Experience, Location, Rate, RateType, Availability, Rating, TotalSubmissions)
VALUES 
(3, 1, 'Alex Rodriguez', 'alex.rodriguez@email.com', '+1-555-1001', 
 '["React", "Node.js", "AWS", "TypeScript", "GraphQL"]', 8, 'New York, NY', 85.00, 'Hourly', 'Available', 4.8, 23),
(3, 1, 'Maria Chen', 'maria.chen@email.com', '+1-555-1002', 
 '["Docker", "Kubernetes", "CI/CD", "Python", "Terraform"]', 6, 'San Francisco, CA', 90.00, 'Hourly', 'On Project', 4.9, 18);

-- Sample Job Requirements
INSERT INTO JobRequirements (UserId, TeamId, Title, Client, ClientContact, ClientEmail, Status, Priority, Location, JobType, Duration, Rate, RateType, Experience, Skills, Description, Source, AiConfidence, RecruiterAssigned, Urgency, ClientRating, Budget, StartDate)
VALUES 
(3, 1, 'Senior React Developer', 'TechCorp Inc.', 'Sarah Johnson', 'hiring@techcorp.com', 'active', 'High', 'Remote', 'Contract', '6 months', '$80-100/hour', 'Hourly', 5, 
 '["React", "TypeScript", "Node.js", "AWS", "GraphQL"]', 
 'We are looking for a Senior React Developer with extensive experience in modern React development, TypeScript, and cloud technologies.', 
 'email_extraction', 95, 'John Recruiter', 'High', 4.8, 50000.00, DATEADD(DAY, 15, GETUTCDATE()));

-- Sample Emails
INSERT INTO Emails (UserId, TeamId, FromEmail, FromName, Subject, Preview, Body, Status, Priority, AiConfidence, Category, RelatedJobId)
VALUES 
(3, 1, 'hiring@techcorp.com', 'Sarah Johnson - TechCorp', 'Urgent: Senior React Developer Position - Remote', 
 'We have an immediate need for a Senior React Developer with 5+ years experience...', 
 'We have an immediate need for a Senior React Developer with 5+ years experience in modern React, TypeScript, and Node.js. The role is fully remote and offers competitive compensation.',
 'processed', 'High', 95, 'job_requirement', 1);

-- =============================================
-- 7. INDEXES FOR PERFORMANCE
-- =============================================

-- User indexes
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_Role ON Users(RoleId);
CREATE INDEX IX_Users_Team ON Users(TeamId);
CREATE INDEX IX_Users_Active ON Users(IsActive);

-- Consultant indexes
CREATE INDEX IX_Consultants_User ON Consultants(UserId);
CREATE INDEX IX_Consultants_Team ON Consultants(TeamId);
CREATE INDEX IX_Consultants_Active ON Consultants(IsActive);
CREATE INDEX IX_Consultants_Availability ON Consultants(Availability);

-- Job Requirements indexes
CREATE INDEX IX_JobRequirements_User ON JobRequirements(UserId);
CREATE INDEX IX_JobRequirements_Team ON JobRequirements(TeamId);
CREATE INDEX IX_JobRequirements_Status ON JobRequirements(Status);
CREATE INDEX IX_JobRequirements_Priority ON JobRequirements(Priority);

-- Email indexes
CREATE INDEX IX_Emails_User ON Emails(UserId);
CREATE INDEX IX_Emails_Team ON Emails(TeamId);
CREATE INDEX IX_Emails_Status ON Emails(Status);
CREATE INDEX IX_Emails_Category ON Emails(Category);

-- Submission indexes
CREATE INDEX IX_Submissions_User ON Submissions(UserId);
CREATE INDEX IX_Submissions_Team ON Submissions(TeamId);
CREATE INDEX IX_Submissions_Job ON Submissions(JobId);
CREATE INDEX IX_Submissions_Consultant ON Submissions(ConsultantId);
CREATE INDEX IX_Submissions_Status ON Submissions(Status);

-- =============================================
-- 8. STORED PROCEDURES FOR COMMON OPERATIONS
-- =============================================

-- Get Dashboard Stats for Super Admin
CREATE PROCEDURE sp_GetSuperAdminDashboardStats
AS
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM Users WHERE RoleId = 3 AND IsActive = 1) AS TotalRecruiters,
        (SELECT COUNT(*) FROM Users WHERE RoleId = 2 AND IsActive = 1) AS TotalAdmins,
        (SELECT COUNT(*) FROM Teams WHERE IsActive = 1) AS TotalTeams,
        (SELECT COUNT(*) FROM Consultants WHERE IsActive = 1) AS TotalConsultants,
        (SELECT COUNT(*) FROM Submissions WHERE CAST(SentAt AS DATE) = CAST(GETUTCDATE() AS DATE)) AS SubmissionsToday,
        (SELECT COUNT(*) FROM Submissions WHERE SentAt >= DATEADD(WEEK, -1, GETUTCDATE())) AS SubmissionsThisWeek,
        (SELECT COUNT(*) FROM Submissions WHERE SentAt >= DATEADD(MONTH, -1, GETUTCDATE())) AS SubmissionsThisMonth,
        (SELECT ISNULL(AVG(CAST(AiConfidence AS FLOAT)), 0) FROM JobRequirements WHERE AiConfidence IS NOT NULL) AS AvgAiAccuracy,
        (SELECT COUNT(*) FROM Users WHERE LastLoginAt < DATEADD(DAY, -7, GETUTCDATE()) AND IsActive = 1) AS InactiveUsers
END
GO

-- Get Dashboard Stats for Team Admin
CREATE PROCEDURE sp_GetTeamAdminDashboardStats
    @TeamId INT
AS
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM Users WHERE TeamId = @TeamId AND RoleId = 3 AND IsActive = 1) AS TeamRecruiters,
        (SELECT COUNT(*) FROM Consultants WHERE TeamId = @TeamId AND IsActive = 1) AS TeamConsultants,
        (SELECT COUNT(*) FROM Submissions WHERE TeamId = @TeamId AND CAST(SentAt AS DATE) = CAST(GETUTCDATE() AS DATE)) AS SubmissionsToday,
        (SELECT COUNT(*) FROM Submissions WHERE TeamId = @TeamId AND SentAt >= DATEADD(WEEK, -1, GETUTCDATE())) AS SubmissionsThisWeek,
        (SELECT ISNULL(AVG(CAST(AiConfidence AS FLOAT)), 0) FROM JobRequirements WHERE TeamId = @TeamId AND AiConfidence IS NOT NULL) AS TeamAiAccuracy,
        (SELECT COUNT(*) FROM Consultants WHERE TeamId = @TeamId AND LastSubmitted < DATEADD(DAY, -2, GETUTCDATE()) AND IsActive = 1) AS IdleConsultants
END
GO

-- Get Dashboard Stats for Recruiter
CREATE PROCEDURE sp_GetRecruiterDashboardStats
    @UserId INT
AS
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM Consultants WHERE UserId = @UserId AND IsActive = 1) AS MyConsultants,
        (SELECT COUNT(*) FROM Submissions WHERE UserId = @UserId AND CAST(SentAt AS DATE) = CAST(GETUTCDATE() AS DATE)) AS SubmissionsToday,
        (SELECT COUNT(*) FROM Submissions WHERE UserId = @UserId AND SentAt >= DATEADD(WEEK, -1, GETUTCDATE())) AS SubmissionsThisWeek,
        (SELECT COUNT(*) FROM Emails WHERE UserId = @UserId AND Status = 'new') AS NewEmails,
        (SELECT COUNT(*) FROM Matches WHERE UserId = @UserId AND IsActive = 1) AS PendingMatches,
        (SELECT COUNT(*) FROM Consultants WHERE UserId = @UserId AND LastSubmitted < DATEADD(DAY, -1, GETUTCDATE()) AND IsActive = 1) AS IdleConsultants
END
GO

-- Check User Limits
CREATE PROCEDURE sp_CheckUserLimits
    @UserId INT
AS
BEGIN
    SELECT 
        ul.*,
        (SELECT COUNT(*) FROM Consultants WHERE UserId = @UserId AND IsActive = 1) AS CurrentResumes,
        (SELECT COUNT(*) FROM Submissions WHERE UserId = @UserId AND CAST(SentAt AS DATE) = CAST(GETUTCDATE() AS DATE)) AS TodaySubmissions
    FROM UserLimits ul
    WHERE ul.UserId = @UserId
END
GO

PRINT 'BenchPilot Database Schema Created Successfully!'
PRINT 'Default Users Created:'
PRINT '  Super Admin: admin@benchpilot.com / password'
PRINT '  Team Admin: teamadmin@benchpilot.com / password'
PRINT '  Recruiter: recruiter@benchpilot.com / password'