# TaskManager - Full Stack Deployment Guide

This guide will help you deploy your TaskManager application (ASP.NET Core API + Angular) for free using modern cloud platforms.

## 🏗️ Architecture Overview

- **Backend**: ASP.NET Core 8 Web API with PostgreSQL
- **Frontend**: Angular 18 
- **Database**: PostgreSQL (free tier)

## 🚀 Free Deployment Options

### Option 1: Railway + Vercel (Recommended)

#### Backend Deployment (Railway)
1. **Prepare your repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Railway**:
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your TaskManager repository
   - Railway will auto-detect the Dockerfile in `TaskManager.Api/`
   - Add a PostgreSQL database service to your project
   - Railway will automatically set the `DATABASE_URL` environment variable

3. **Configure Environment Variables in Railway**:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://+:$PORT
   JwtSettings__Secret=X8f3!kL9@pQ2#zW7$yT6^vR4&nM1*oJ5
   ```

#### Frontend Deployment (Vercel)
1. **Update environment.prod.ts**:
   - Replace `https://your-backend-url.railway.app/api` with your actual Railway backend URL

2. **Deploy to Vercel**:
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project" → Import your repository
   - Set root directory to `TaskManager.App`
   - Vercel will auto-detect Angular and build settings

### Option 2: Render + Netlify

#### Backend Deployment (Render)
1. **Deploy to Render**:
   - Go to [Render.com](https://render.com)
   - Sign up with GitHub
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Name**: taskmanager-api
     - **Root Directory**: TaskManager.Api
     - **Build Command**: `docker build -t taskmanager-api .`
     - **Start Command**: `docker run -p $PORT:8080 taskmanager-api`

2. **Add PostgreSQL Database**:
   - In Render dashboard, click "New" → "PostgreSQL"
   - Note the database URL provided

3. **Environment Variables**:
   ```
   DATABASE_URL=<your-render-postgresql-url>
   ASPNETCORE_ENVIRONMENT=Production
   JwtSettings__Secret=X8f3!kL9@pQ2#zW7$yT6^vR4&nM1*oJ5
   ```

#### Frontend Deployment (Netlify)
1. **Update environment.prod.ts** with your Render backend URL
2. **Deploy to Netlify**:
   - Go to [Netlify.com](https://netlify.com)
   - Drag & drop your `TaskManager.App` folder, or connect via GitHub
   - Build settings are in `netlify.toml`

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+
- .NET 8 SDK
- PostgreSQL (or use Docker)

### Database Setup
1. **Install PostgreSQL locally** or use Docker:
   ```bash
   docker run --name postgres-dev -e POSTGRES_PASSWORD=your_password -p 5432:5432 -d postgres
   ```

2. **Update appsettings.json**:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=TaskManagerDb;Username=postgres;Password=your_password"
     }
   }
   ```

3. **Run migrations**:
   ```bash
   cd TaskManager.Api/BackendW2Proj
   dotnet ef database update
   ```

### Running the Application
1. **Start the backend**:
   ```bash
   cd TaskManager.Api/BackendW2Proj
   dotnet run
   ```

2. **Start the frontend**:
   ```bash
   cd TaskManager.App
   npm install
   npm start
   ```

## 🌐 CORS Configuration

After deployment, update your backend's CORS policy:

1. **In Program.cs**, replace the placeholder URLs with your actual frontend domains:
   ```csharp
   policy.WithOrigins(
       "https://your-app.vercel.app", 
       "https://your-app.netlify.app"
   )
   ```

## 💾 Database Migration Strategy

The application is configured to auto-migrate on startup in production. Your existing SQL Server migrations will need to be recreated for PostgreSQL:

```bash
# Remove old migrations
rm -rf Migrations/

# Create new PostgreSQL migrations
dotnet ef migrations add InitialPostgreSQLMigration
```

## 🔐 Security Considerations

1. **JWT Secret**: Use a strong, random secret (32+ characters)
2. **CORS**: Restrict to your actual frontend domains in production
3. **Environment Variables**: Never commit secrets to git
4. **Database**: Use connection string environment variables

## 📝 Portfolio Links

Once deployed, you'll have:
- **Frontend**: `https://your-app.vercel.app` or `https://your-app.netlify.app`
- **Backend API**: `https://your-api.railway.app` or `https://your-api.onrender.com`
- **API Documentation**: `https://your-api.railway.app/swagger`

## 🆘 Troubleshooting

### Common Issues:
1. **CORS Errors**: Update CORS policy with correct frontend URLs
2. **Database Connection**: Verify DATABASE_URL environment variable
3. **Build Failures**: Check Dockerfile paths and .NET version compatibility
4. **Angular Build Issues**: Ensure environment files are properly configured

### Logs:
- **Railway**: Check logs in Railway dashboard
- **Render**: View logs in Render dashboard  
- **Vercel/Netlify**: Check build logs and function logs

## 💰 Cost Breakdown (Free Tiers)

- **Railway**: $5 credit monthly, PostgreSQL included
- **Render**: 750 hours/month free, PostgreSQL 1GB free
- **Vercel**: 100GB bandwidth, unlimited static sites
- **Netlify**: 300 build minutes, 100GB bandwidth

All options provide sufficient resources for a portfolio project with moderate traffic.

## 🔄 CI/CD

Both platforms support automatic deployments:
- **Railway/Render**: Auto-deploy on git push to main branch  
- **Vercel/Netlify**: Auto-deploy on git push, with preview deployments for PRs

Your TaskManager app will be live and fully functional for portfolio demonstration!
