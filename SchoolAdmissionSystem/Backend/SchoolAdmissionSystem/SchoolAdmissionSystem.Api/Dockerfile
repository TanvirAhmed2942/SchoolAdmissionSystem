
# Base stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app

EXPOSE 8080
EXPOSE 8081

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["SchoolAdmissionSystem.Api/SchoolAdmissionSystem.Api.csproj", "SchoolAdmissionSystem.Api/"]
RUN dotnet restore "./SchoolAdmissionSystem.Api/SchoolAdmissionSystem.Api.csproj"

COPY . .
WORKDIR "/src/SchoolAdmissionSystem.Api"

RUN dotnet build "./SchoolAdmissionSystem.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release

RUN dotnet publish "./SchoolAdmissionSystem.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Development runtime stage
FROM base AS final

ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_HTTP_PORTS=8080

WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "SchoolAdmissionSystem.Api.dll"]
