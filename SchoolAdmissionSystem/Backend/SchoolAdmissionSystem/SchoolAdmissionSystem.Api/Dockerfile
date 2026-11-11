# Runtime base
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

# Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy every project file first so the restore layer is cached
COPY ["SchoolAdmissionSystem.Api/SchoolAdmissionSystem.Api.csproj", "SchoolAdmissionSystem.Api/"]
COPY ["SchoolAdmissionSystem.Application/SchoolAdmissionSystem.Application.csproj", "SchoolAdmissionSystem.Application/"]
COPY ["SchoolAdmissionSystem.Domain/SchoolAdmissionSystem.Domain.csproj", "SchoolAdmissionSystem.Domain/"]
COPY ["SchoolAdmissionSystem.Infrastructure/SchoolAdmissionSystem.Infrastructure.csproj", "SchoolAdmissionSystem.Infrastructure/"]
RUN dotnet restore "SchoolAdmissionSystem.Api/SchoolAdmissionSystem.Api.csproj"

# Copy the rest of the source
COPY . .

# Publish (this builds too, so a separate "dotnet build" step is unnecessary)
RUN dotnet publish "SchoolAdmissionSystem.Api/SchoolAdmissionSystem.Api.csproj" \
    -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false --no-restore

# Final image
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SchoolAdmissionSystem.Api.dll"]