# Use the official .NET 8 runtime as the base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Use the .NET 8 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY BackendW2Proj/BackendW2Proj.csproj BackendW2Proj/
RUN dotnet restore BackendW2Proj/BackendW2Proj.csproj

# Copy everything else and build
COPY BackendW2Proj/. BackendW2Proj/
WORKDIR /src/BackendW2Proj
RUN dotnet publish BackendW2Proj.csproj -c Release -o /app/publish

# Final image
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "BackendW2Proj.dll"]
