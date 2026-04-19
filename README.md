# Hack2On

Full-stack electricity analytics platform for detecting non-technical losses (NTL), visualizing network assets, and tracking outage events.

This repository contains:
- A Next.js frontend in client/front
- An ASP.NET Core Web API backend in server/Hack2on/Hack2on

## Tech Stack

### Client
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Leaflet + react-leaflet

### Server
- ASP.NET Core 8 Web API
- Dapper
- SQL Server
- Swagger/OpenAPI

## Repository Structure

```text
Hack2On/
  client/
    front/                 # Next.js frontend
  server/
    Hack2on/
      Hack2on/             # ASP.NET Core API project
```

## Main Features

- NTL summary dashboard and top offender analytics
- Feeder anomaly scoring and classification
- Grid map visualization (transmission stations, substations, DT stations)
- Outage monitoring:
  - Current outages
  - Historical outages
  - Per-record map focus from outage tables

## Frontend Pages

- / : Landing page
- /summary : NTL analytics dashboard
- /visualisation : Grid map and feeder context
- /outages : Current and past outages with pagination and map focus

## Backend API Overview

Base host in development (from launch settings):
- https://localhost:7061
- http://localhost:5601

### Endpoints

- GET /api/Summary
  - Query params: from, to
  - Returns KPI summary and top offenders

- GET /api/feeders/anomalies
  - Query params: from, to
  - Returns feeder anomaly results

- GET /api/feeders/{id}/load-profile
  - Query params: from, to
  - Returns feeder hourly load profile

- GET /api/registry/transmission-stations
- GET /api/registry/substations
- GET /api/registry/distribution-substations
  - Optional query param: feederIds=1,2,3

- GET /history
- GET /current
  - Outage endpoints currently use absolute routes in controller attributes.
  - The frontend outage client also supports /api/outages/history and /api/outages/current as fallbacks.

- GET /api/transmission-stations/nzm

## Prerequisites

- Node.js 20+
- npm 10+
- .NET SDK 8.0+
- SQL Server instance with the expected schema/data

## Configuration

### Server

Server config file:
- server/Hack2on/Hack2on/appsettings.json

Important settings:
- ConnectionStrings:SotexDb
- Analysis:* thresholds and default window

Example connection string key:
- SotexDb

### Client

Client uses:
- NEXT_PUBLIC_API_BASE_URL

Create client/front/.env.local:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5601
```

If not set, the API clients default to http://localhost:5601.

## Run Locally

Open two terminals.

### 1) Run backend

```bash
cd server/Hack2on/Hack2on
dotnet restore
dotnet run
```

Useful URL:
- Swagger UI: https://localhost:7061/swagger

### 2) Run frontend

```bash
cd client/front
npm install
npm run dev
```

Open:
- http://localhost:3000

## Frontend Scripts

In client/front:

- npm run dev
  - Starts Next.js dev server (configured with webpack and memory cap)
- npm run build
- npm run start
- npm run lint

## Notes

- Backend uses Dapper (not EF migrations). Ensure database schema/data are available before running.
- CORS is configured to allow any origin in Program.cs for local integration.
- JSON enum values are serialized as strings in API responses.

## Troubleshooting

- Client cannot reach API:
  - Verify backend is running on localhost:5601 or update NEXT_PUBLIC_API_BASE_URL.
- HTTPS certificate issues in local tools:
  - Use http://localhost:5601 for local client calls where needed.
- Outage endpoint 404 under /api/outages/*:
  - Current controller attributes expose /history and /current directly.

## Development Workflow

Recommended order:
1. Start backend
2. Start frontend
3. Validate with Swagger
4. Run npm run lint before committing
