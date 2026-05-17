# Stage 1: build frontend
FROM node:20-alpine AS frontend
WORKDIR /app
RUN npm install -g pnpm@9
COPY package.json ./
RUN pnpm install --no-frozen-lockfile --ignore-scripts
COPY src/ src/
COPY index.html vite.config.js ./
RUN pnpm run build

# Stage 2: build backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend
WORKDIR /src
COPY backend/PomodoroApi.csproj ./
RUN dotnet restore
COPY backend/ ./
RUN dotnet publish -c Release -o /app/publish

# Stage 3: final image
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=backend /app/publish .
COPY --from=frontend /app/dist ./wwwroot
EXPOSE 8080
ENTRYPOINT ["dotnet", "PomodoroApi.dll"]
