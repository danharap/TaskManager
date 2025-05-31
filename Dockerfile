# Use the official .NET 8 runtime as the base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Use the .NET 8 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ["TaskManager.Api/BackendW2Proj/BackendW2Proj.csproj", "TaskManager.Api/BackendW2Proj/"]
RUN dotnet restore "TaskManager.Api/BackendW2Proj/BackendW2Proj.csproj"

# Copy the entire project and build
COPY . .
WORKDIR "/src/TaskManager.Api/BackendW2Proj"
RUN dotnet build "BackendW2Proj.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "BackendW2Proj.csproj" -c Release -o /app/publish

# Final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Set environment variable for ASP.NET Core to listen on all interfaces
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "BackendW2Proj.dll"]
