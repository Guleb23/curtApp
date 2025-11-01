# Этап runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5034

# Этап сборки
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Копируем csproj и восстанавливаем зависимости (для кеширования слоёв)
COPY ["EmailService.csproj", "./"]
RUN dotnet restore "EmailService.csproj"

# Копируем весь код
COPY . .

# Строим проект
RUN dotnet build "EmailService.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Публикуем проект
FROM build AS publish
RUN dotnet publish "EmailService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Финальный этап
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EmailService.dll"]
