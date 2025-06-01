# Full-Stack Deployment Guide: TaskManager Application

This document outlines the complete process of deploying a full-stack ASP.NET Core API + Angular application to Railway (backend) and Vercel (frontend), with PostgreSQL database integration.

## 1. Backend Preparation (ASP.NET Core API)

### 1.1. Converting from SQL Server to PostgreSQL

```csharp
// Install PostgreSQL package
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

Make sure the PostgreSQL package version matches your Entity Framework version:
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="9.0.4" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.0.4" />
```

### 1.2. Connection String Handling in Program.cs

Update Program.cs to handle both local and Railway PostgreSQL connection strings:

```csharp
// Configure database connection
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") 
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (!string.IsNullOrEmpty(connectionString))
    {
        // Railway provides DATABASE_URL in this format:
        // postgresql://user:password@host:port/database
        // We need to convert it to standard Npgsql connection string format
        if (connectionString.StartsWith("postgresql://"))
        {
            // Extract connection parts
            var uri = new Uri(connectionString);
            var userInfo = uri.UserInfo.Split(':');
            var username = userInfo[0];
            var password = userInfo[1];
            var host = uri.Host;
            var port = uri.Port;
            var database = uri.AbsolutePath.TrimStart('/');
            
            // Build Npgsql connection string
            connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};";
        }
        
        options.UseNpgsql(connectionString);
    }
    else
    {
        throw new InvalidOperationException("Database connection string is not configured. Please set DATABASE_URL environment variable.");
    }
});
```

### 1.3. Database Creation and Migration

Enhanced database initialization to ensure proper migration in production:

```csharp
// Auto-migrate database on startup for deployment
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        logger.LogInformation("Attempting to ensure database is created...");
        // First ensure the database exists
        context.Database.EnsureCreated();
        
        logger.LogInformation("Attempting to apply migrations...");
        // Then apply any pending migrations
        context.Database.Migrate();
        
        logger.LogInformation("Database migration completed successfully");
    }
    catch (Exception ex)
    {
        // Log the error but don't crash the app
        logger.LogError(ex, "An error occurred while migrating the database.");
        
        // Try to create the database schema directly if migration fails
        try {
            logger.LogInformation("Migration failed. Attempting to create database schema directly...");
            context.Database.EnsureCreated();
            logger.LogInformation("Database schema created successfully");
        }
        catch (Exception innerEx) {
            logger.LogError(innerEx, "Failed to create database schema directly.");
        }
    }
}
```

### 1.4. CORS Policy for Production

Update CORS policy to allow requests from your frontend:

```csharp
// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
        else
        {
            // In production, be more specific about allowed origins
            policy.WithOrigins("https://task-manager-daniel-harapiaks-projects.vercel.app")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
    });
});
```

### 1.5. Explicit Table Naming in AppDbContext

Add explicit table mappings to ensure correct database schema:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // Explicitly define table names and schema
    modelBuilder.Entity<UserModel>().ToTable("Users");
    modelBuilder.Entity<TaskModel>().ToTable("Tasks");
    modelBuilder.Entity<SubTaskModel>().ToTable("SubTasks");
    modelBuilder.Entity<NotificationModel>().ToTable("Notifications");
}
```

### 1.6. Backend Dockerfile for Railway

Create Dockerfile in TaskManager.Api directory:

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["BackendW2Proj/BackendW2Proj.csproj", "BackendW2Proj/"]
RUN dotnet restore "BackendW2Proj/BackendW2Proj.csproj"
COPY . .
WORKDIR "/src/BackendW2Proj"
RUN dotnet build "BackendW2Proj.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BackendW2Proj.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BackendW2Proj.dll"]
```

### 1.7. Health Check Endpoint

Create a health check endpoint for monitoring:

```csharp
// HealthController.cs
using Microsoft.AspNetCore.Mvc;

namespace BackendW2Proj.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { status = "Healthy", timestamp = DateTime.UtcNow });
        }
    }
}
```

## 2. Frontend Preparation (Angular)

### 2.1. Environment Configuration

Create environment files for production vs development:

**environment.ts (Development)**:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7024/api'
};
```

**environment.prod.ts (Production)**:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://taskmanager-fullstack-production.up.railway.app/api'
};
```

### 2.2. Update Angular Services

Update all services to use environment variables:

```typescript
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Methods using this.apiUrl
}
```

### 2.3. Vercel Configuration for Angular

Create vercel.json in your Angular project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/fullstack-app/browser"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 3. Railway Deployment Steps

### 3.1. Create Railway Project

1. Create a new project in Railway dashboard
2. Add your GitHub repository

### 3.2. Add PostgreSQL Database

1. Click "+ New" → "Database" → "Add PostgreSQL"
2. Railway will create a PostgreSQL instance and generate connection variables

### 3.3. Configure Environment Variables for Backend

In your API service, set these environment variables:

| Variable Name | Variable Value |
|---------------|----------------|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `JwtSettings__Secret` | `X8f3!kL9@pQ2#zW7$yT6^vR4&nM1*oJ5` |
| `DATABASE_URL` | `postgresql://postgres:password@postgres.railway.internal:5432/railway` |

### 3.4. Setup Public Networking for API

1. Go to your API service in Railway
2. Click the "Settings" tab
3. Under "Networking" section, add a public domain
4. Note the generated URL (e.g., `taskmanager-fullstack-production.up.railway.app`)

## 4. Vercel Deployment Steps

### 4.1. Deploy Frontend to Vercel

1. Log in to Vercel and create a new project
2. Import your GitHub repository
3. Configure build settings:
   - Framework Preset: Angular
   - Build Command: `npm run build`
   - Output Directory: `dist/fullstack-app/browser`
4. Deploy the project

### 4.2. Update CORS Policy with Vercel URL

Update your API's CORS policy with the Vercel domain:

```csharp
policy.WithOrigins("https://task-manager-daniel-harapiaks-projects.vercel.app")
      .AllowAnyMethod()
      .AllowAnyHeader()
      .AllowCredentials();
```

## 5. Troubleshooting Common Issues

### 5.1. PostgreSQL Connection Issues

If you encounter database connection errors:

1. Ensure the DATABASE_URL environment variable is correctly set in Railway
2. Verify that the connection string parser correctly extracts username, password, host, port, and database name
3. Check if the API service can communicate with the PostgreSQL service (they should be in the same Railway project)

### 5.2. Table Creation Issues

If tables aren't being created:

1. Use both `EnsureCreated()` and `Migrate()` methods
2. Explicitly define table names in `OnModelCreating`
3. Enhance logging to see database operation details

### 5.3. CORS Issues

For CORS-related errors:

1. Make sure frontend URL is correctly added to the CORS policy
2. Ensure `AllowCredentials()` is used with specific origins
3. Place UseCors middleware before authentication middleware

### 5.4. Angular Routing on Vercel

For 404 errors on page refresh:

1. Make sure vercel.json has the correct SPA routing configuration
2. Check that the distDir path includes the browser subfolder for Angular 18+ projects

## 6. Maintenance and Updates

### 6.1. Monitoring Deployed Services

1. Use the Health endpoint to verify your API is running: 
   - `https://yourdomain.railway.app/api/health`

### 6.2. Updating Environment Variables

1. To update environment variables in Railway:
   - Go to your service
   - Click "Variables" tab
   - Edit existing variables or add new ones

### 6.3. Database Backups

1. Railway automatically creates backups for PostgreSQL
2. You can create manual backups from the PostgreSQL service dashboard

---

## 7. Deployment Checklist

### Backend (Railway)
- [ ] Update from SQL Server to PostgreSQL
- [ ] Add connection string handling for Railway
- [ ] Configure CORS for production
- [ ] Add database migration and creation code
- [ ] Create Dockerfile for Railway
- [ ] Add health check endpoint
- [ ] Push code to GitHub
- [ ] Create Railway project and connect repository
- [ ] Add PostgreSQL in Railway
- [ ] Configure environment variables
- [ ] Setup networking domain

### Frontend (Vercel)
- [ ] Create environment.prod.ts with backend URL
- [ ] Update all services to use environment variables
- [ ] Create vercel.json with proper routing
- [ ] Configure build settings
- [ ] Deploy to Vercel
- [ ] Test frontend-backend connection

This deployment setup creates a fully functional, production-ready full-stack web application with:
- ASP.NET Core API backend on Railway
- PostgreSQL database on Railway
- Angular frontend on Vercel
- Secure cross-domain communication through proper CORS configuration
- Automatic database migrations
- Environment-specific configuration
