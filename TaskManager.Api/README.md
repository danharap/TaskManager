# TaskManager.Api - Backend Setup Guide

This is the ASP.NET Core Web API backend for the TaskManager fullstack application. This guide will walk you through setting up the backend server, configuring the database, and running the API.

## 🔧 Prerequisites

Before setting up the backend, ensure you have the following installed:

### Required Software
- **.NET 8.0 SDK** or higher
  - Download: [https://dotnet.microsoft.com/download/dotnet/8.0](https://dotnet.microsoft.com/download/dotnet/8.0)
  - Verify installation: `dotnet --version`

- **SQL Server LocalDB** (included with Visual Studio or SQL Server Express)
  - Alternative: SQL Server Express or full SQL Server instance
  - For LocalDB installation: [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

- **Visual Studio 2022** (recommended) or **Visual Studio Code**
  - Visual Studio: [Download here](https://visualstudio.microsoft.com/downloads/)
  - VS Code: [Download here](https://code.visualstudio.com/) + C# extension

### Optional Tools
- **SQL Server Management Studio (SSMS)** - for database management
- **Postman** or **Insomnia** - for API testing
- **Entity Framework Core CLI** - for advanced database operations

## 📂 Project Structure

```
TaskManager.Api/
├── BackendW2Proj.sln          # Solution file
└── BackendW2Proj/             # Main project folder
    ├── Controllers/           # API Controllers
    │   ├── AuthController.cs  # Authentication endpoints
    │   ├── TaskController.cs  # Task management endpoints
    │   └── NotificationsController.cs # Notification endpoints
    ├── Data/
    │   └── AppDbContext.cs    # Entity Framework DbContext
    ├── Models/                # Data models
    │   ├── UserModel.cs       # User entity
    │   ├── TaskModel.cs       # Task entity
    │   ├── SubTaskModel.cs    # SubTask entity
    │   └── NotificationModel.cs # Notification entity
    ├── Migrations/            # EF Core database migrations
    ├── Properties/
    │   └── launchSettings.json # Development launch settings
    ├── appsettings.json       # Production configuration
    ├── appsettings.Development.json # Development configuration
    ├── Program.cs             # Application entry point
    └── BackendW2Proj.csproj   # Project file
```

## 🚀 Quick Start

### 1. Navigate to Backend Directory
```powershell
cd TaskManager.Api\BackendW2Proj
```

### 2. Restore NuGet Packages
```powershell
dotnet restore
```

### 3. Update Database
```powershell
dotnet ef database update
```

### 4. Run the Application
```powershell
dotnet run
```

The API will be available at:
- **HTTPS**: `https://localhost:7119`
- **HTTP**: `http://localhost:5000`
- **Swagger UI**: `https://localhost:7119/swagger`

## 🗃️ Database Setup

### Database Configuration

The application uses **SQL Server LocalDB** by default. The connection string is configured in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=BackendW2ProjDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

### Database Schema

The application includes the following tables:
- **Users** - User accounts with authentication
- **Tasks** - Main task entities with priorities and dates
- **SubTasks** - Subtasks belonging to main tasks
- **Notifications** - User notification system

### Entity Framework Migrations

The project includes several migrations that create the database schema:

1. `InitialCreate` - Basic user system
2. `AddRoleToUserModel` - User roles (Admin/User)
3. `AddTasksTable` - Task management system
4. `AddPlannedCompletionDateToTasks` - Task deadline functionality
5. `AddSubTasksTable` - Subtask system
6. `AddStatusToSubTask` - Subtask status tracking
7. `AddNotificationsTable` - Notification system

### Manual Database Setup

If you encounter issues with automatic migration, follow these steps:

#### Step 1: Install EF Core CLI (if not installed)
```powershell
dotnet tool install --global dotnet-ef
```

#### Step 2: Verify Migration Status
```powershell
dotnet ef migrations list
```

#### Step 3: Update Database
```powershell
dotnet ef database update
```

#### Step 4: Verify Database Creation
Check that the database `BackendW2ProjDb` is created in SQL Server LocalDB.

### Alternative Database Providers

#### Using SQL Server Express
Update the connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=BackendW2ProjDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

#### Using a Full SQL Server Instance
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=BackendW2ProjDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

#### Using SQL Server with Authentication
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=BackendW2ProjDb;User Id=YOUR_USERNAME;Password=YOUR_PASSWORD;MultipleActiveResultSets=true"
  }
}
```

## 🔑 Configuration

### JWT Authentication Setup

The application uses JWT tokens for authentication. The JWT secret is configured in `appsettings.json`:

```json
{
  "JwtSettings": {
    "Secret": "X8f3!kL9@pQ2#zW7$yT6^vR4&nM1*oJ5"
  }
}
```

**Security Note**: Change the JWT secret in production to a unique, secure value (minimum 32 characters).

### CORS Configuration

The API is configured to allow cross-origin requests from any origin for development purposes. In production, update the CORS policy in `Program.cs` to restrict origins:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("ProductionPolicy", policy =>
    {
        policy.WithOrigins("https://yourdomain.com") // Replace with your frontend domain
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

## 📡 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `PUT /api/auth/username` - Change username (authenticated)
- `PUT /api/auth/password` - Change password (authenticated)
- `DELETE /api/auth/account` - Delete own account (authenticated)

### Task Management Endpoints
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `GET /api/tasks/{id}/subtasks` - Get subtasks for a task
- `POST /api/tasks/{id}/subtasks` - Create a subtask
- `PUT /api/subtasks/{id}` - Update a subtask
- `DELETE /api/subtasks/{id}` - Delete a subtask

### Notification Endpoints
- `GET /api/notifications` - Get user's notifications
- `POST /api/notifications` - Create a notification
- `PUT /api/notifications/{id}/read` - Mark notification as read
- `DELETE /api/notifications/{id}` - Delete a notification

### Admin Endpoints (Admin role required)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}/role` - Update user role
- `DELETE /api/admin/users/{id}` - Delete a user

## 🧪 Testing the API

### Using Swagger UI
1. Run the application: `dotnet run`
2. Open your browser and navigate to: `https://localhost:7119/swagger`
3. Test endpoints directly from the Swagger interface

### Using Postman/Insomnia

#### 1. Register a User
```http
POST https://localhost:7119/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "passwordHash": "testpassword"
}
```

#### 2. Login
```http
POST https://localhost:7119/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "passwordHash": "testpassword"
}
```

#### 3. Create a Task (requires JWT token)
```http
POST https://localhost:7119/api/tasks
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "title": "Sample Task",
  "description": "This is a test task",
  "priority": "High",
  "plannedCompletionDate": "2024-12-31T23:59:59"
}
```

## 🔧 Development

### Building the Project
```powershell
dotnet build
```

### Running in Development Mode
```powershell
dotnet run --environment Development
```

### Running Tests (if implemented)
```powershell
dotnet test
```

### Creating New Migrations
When you modify the data models, create a new migration:
```powershell
dotnet ef migrations add MigrationName
dotnet ef database update
```

### Reverting Migrations
To revert to a previous migration:
```powershell
dotnet ef database update PreviousMigrationName
```

## 🚀 Deployment

### Publishing for Production
```powershell
dotnet publish -c Release -o ./publish
```

### Environment Variables for Production
Set these environment variables in your production environment:
- `ConnectionStrings__DefaultConnection` - Production database connection string
- `JwtSettings__Secret` - Production JWT secret key

### IIS Deployment
1. Publish the application
2. Copy the published files to your IIS web directory
3. Configure the application pool to use "No Managed Code"
4. Ensure the application pool identity has access to the database

## 🛠️ Troubleshooting

### Common Issues

#### 1. Database Connection Issues
**Error**: `Cannot open database "BackendW2ProjDb"`
**Solution**: 
- Ensure SQL Server LocalDB is installed and running
- Verify the connection string in `appsettings.json`
- Run `dotnet ef database update` to create the database

#### 2. Migration Issues
**Error**: `No migrations found`
**Solution**:
```powershell
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### 3. JWT Token Issues
**Error**: `IDX10214: Key size must be at least 256 bits`
**Solution**: Ensure the JWT secret in `appsettings.json` is at least 32 characters long

#### 4. CORS Issues
**Error**: Cross-origin requests blocked
**Solution**: Verify CORS policy in `Program.cs` allows your frontend domain

#### 5. Port Already in Use
**Error**: `Unable to bind to https://localhost:7119`
**Solution**: 
- Check if another application is using the port
- Modify the port in `launchSettings.json`
- Stop other running instances

### Checking Application Health
```powershell
# Check if the application is running
Invoke-WebRequest -Uri "https://localhost:7119/swagger" -UseBasicParsing

# Check database connection
dotnet ef database update --dry-run
```

## 📚 Additional Resources

### Entity Framework Core
- [EF Core Documentation](https://docs.microsoft.com/en-us/ef/core/)
- [Code First Migrations](https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/)

### ASP.NET Core
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Web API Documentation](https://docs.microsoft.com/en-us/aspnet/core/web-api/)

### JWT Authentication
- [JWT.io](https://jwt.io/) - JWT token decoder
- [ASP.NET Core JWT Documentation](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/jwt-authn)

### SQL Server
- [SQL Server LocalDB Documentation](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb)
- [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)

## 🤝 Support

If you encounter issues:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the console output for error messages
3. Check the application logs
4. Verify all prerequisites are installed correctly

---

**Note**: This backend is designed to work with the TaskManager.App Angular frontend. Ensure both applications are running for full functionality.
