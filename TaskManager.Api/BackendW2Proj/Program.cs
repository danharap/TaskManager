using BackendW2Proj.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

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
        }        else
        {
            // In production, be more specific about allowed origins
            policy.WithOrigins("https://task-manager-daniel-harapiaks-projects.vercel.app")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
    });
});

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

// Add JWT Authentication
var jwtSecret = builder.Configuration["JwtSettings:Secret"];
if (string.IsNullOrEmpty(jwtSecret) || Encoding.ASCII.GetBytes(jwtSecret).Length < 32)
{
    throw new InvalidOperationException("JWT secret key is missing or too short. Ensure it is at least 32 characters long.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecret)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();

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
        try
        {
            logger.LogInformation("Migration failed. Attempting to create database schema directly...");
            
            // This will ensure tables are created based on your model without using migrations
            context.Database.EnsureCreated();
            
            logger.LogInformation("Database schema created successfully");
        }
        catch (Exception innerEx)
        {
            logger.LogError(innerEx, "Failed to create database schema directly.");
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply the CORS policy before authentication and authorization
app.UseCors("AllowAllOrigins");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
