# BenchPilot - Complete .NET + Angular Implementation

This is a complete clone of the React BenchPilot application converted to .NET Core API + Angular frontend.

## Prerequisites

1. Visual Studio 2022 (with ASP.NET and Node.js workloads)
2. .NET 8.0 SDK
3. Node.js (LTS version)
4. SQL Server Express/LocalDB
5. Angular CLI: `npm install -g @angular/cli`

## Solution Structure

```
BenchPilot/
├── BenchPilot.API/              # ASP.NET Core Web API
├── BenchPilot.Core/             # Domain Models & Interfaces
├── BenchPilot.Infrastructure/   # Data Access & External Services
├── BenchPilot.Application/      # Business Logic & Services
└── BenchPilot.Client/          # Angular Frontend
```

## Setup Instructions

### 1. Create Solution in Visual Studio 2022

1. Open Visual Studio 2022
2. Create New Project → Blank Solution
3. Name: `BenchPilot`

### 2. Add Backend Projects

Add these projects to the solution:

**a) ASP.NET Core Web API:**
- Right-click Solution → Add → New Project
- Select "ASP.NET Core Web API"
- Name: `BenchPilot.API`
- Framework: .NET 8.0

**b) Class Libraries:**
- Add → New Project → Class Library (.NET)
- Create: `BenchPilot.Core`, `BenchPilot.Infrastructure`, `BenchPilot.Application`

### 3. Create Angular Frontend

Open terminal in solution root:
```bash
ng new BenchPilot.Client --routing --style=scss --skip-git
cd BenchPilot.Client
npm install @angular/material @angular/cdk @angular/animations
npm install @angular/flex-layout
npm install chart.js ng2-charts
npm install @microsoft/signalr
npm install lucide-angular
```

### 4. Install NuGet Packages

In Package Manager Console:

```powershell
# For BenchPilot.API
Install-Package Microsoft.EntityFrameworkCore.SqlServer
Install-Package Microsoft.EntityFrameworkCore.Tools
Install-Package Microsoft.AspNetCore.Identity.EntityFrameworkCore
Install-Package Microsoft.AspNetCore.Authentication.JwtBearer
Install-Package AutoMapper.Extensions.Microsoft.DependencyInjection
Install-Package Swashbuckle.AspNetCore
Install-Package Microsoft.AspNetCore.SignalR
Install-Package Serilog.AspNetCore
Install-Package FluentValidation.AspNetCore

# For BenchPilot.Infrastructure
Install-Package Microsoft.EntityFrameworkCore.SqlServer
Install-Package Microsoft.EntityFrameworkCore.Tools
Install-Package Microsoft.AspNetCore.Identity.EntityFrameworkCore

# For BenchPilot.Application
Install-Package AutoMapper
Install-Package FluentValidation
Install-Package MediatR.Extensions.Microsoft.DependencyInjection
```

### 5. Database Setup

1. Update connection string in `appsettings.json`
2. Run migrations:
```powershell
Add-Migration InitialCreate
Update-Database
```

### 6. Run the Application

1. Set multiple startup projects (API + Client)
2. API runs on: `https://localhost:7001`
3. Angular runs on: `http://localhost:4200`

## Features Implemented

✅ Dashboard with real-time metrics
✅ Email inbox with AI processing
✅ Consultant management with profiles
✅ Job requirements management
✅ AI matching engine
✅ Submission tracking
✅ Real-time notifications
✅ File upload for resumes
✅ Bulk operations
✅ Advanced filtering and search
✅ Responsive design matching original

## Development Notes

- All components match the original React implementation
- Same color scheme and styling
- Identical functionality and user experience
- Real-time features using SignalR
- Complete CRUD operations for all entities
- AI simulation for matching and processing