# ===== Этап сборки =====
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["ApiForSud.csproj", "./"]
RUN dotnet restore "ApiForSud.csproj"

COPY . .
RUN dotnet publish "ApiForSud.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ===== Финальный образ =====
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

COPY ./wwwroot/fonts ./wwwroot/fonts

# Контейнер слушает только HTTP
ENV ASPNETCORE_URLS=http://+:7080
EXPOSE 7080

ENTRYPOINT ["dotnet", "ApiForSud.dll"]
