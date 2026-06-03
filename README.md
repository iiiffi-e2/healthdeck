# HealthDeck

A modern web dashboard for Google Health API / Fitbit / Pixel Watch users. Connect your Google account, sync wellness data, and explore sleep, heart, activity, and exercise trends from a desktop-first Material Design UI.

## Stack

- Next.js App Router · React · TypeScript
- Material UI (Material Design 3 inspired)
- Prisma · PostgreSQL
- Auth.js (NextAuth) · Google OAuth
- Recharts · Framer Motion

## Getting started

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Set `DATABASE_URL`, `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`.

3. Install and migrate:

```bash
npm install
npx prisma migrate dev
npx prisma generate
```

4. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Mock data mode

By default, `USE_MOCK_HEALTH_DATA=true` serves realistic demo data so the UI works without Google Health API credentials. Set `GOOGLE_HEALTH_API_ENABLED=true` and configure OAuth when ready for live sync.

## API routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/health/status` | GET | Connection & sync status |
| `/api/health/connect` | POST | Link Google Health tokens |
| `/api/health/sync` | POST | Sync user health data |
| `/api/health/summary` | GET | Dashboard aggregates |
| `/api/health/sleep` | GET | Sleep metrics |
| `/api/health/heart` | GET | Heart metrics |
| `/api/health/activity` | GET | Activity metrics |
| `/api/health/exercise` | GET | Workout sessions |
| `/api/reports/csv` | GET | CSV export |
| `/api/reports/pdf` | GET | PDF export |
| `/api/account/delete-data` | DELETE | Delete synced data |

## Disclaimer

HealthDeck provides wellness insights only and is not medical advice. Always consult a licensed healthcare professional for medical concerns.
