# 1. Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Копируем csproj и восстанавливаем зависимости
COPY BackGroundService.csproj ./
RUN dotnet restore ./BackGroundService.csproj

# Копируем весь проект
COPY . ./

RUN dotnet publish BackGroundService.csproj -c Release -o /app/publish /p:UseAppHost=false

# 2. Runtime stage
FROM mcr.microsoft.com/dotnet/runtime:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "BackGroundService.dll"]
