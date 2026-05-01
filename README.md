# PooPals

PooPals is a social poop tracking and health companion app. The repository is organized as a small product monorepo with separate frontend and backend areas.

## Features

- Log Bristol Stool Scale type, volume, color, duration, notes, photos, and optional location.
- Track session timing, health score, alerts, streaks, achievements, and monthly reports.
- Find nearby toilets with Google Maps integration and venue metadata.
- View social feed updates, privacy-blurred photos, leaderboards, and friend activity.

## Repository Layout

```text
.
+-- frontend/            # Expo React Native application
|   +-- app/             # Expo Router routes
|   +-- assets/          # Fonts and app images
|   +-- components/      # Shared React Native UI components
|   +-- constants/       # App constants
|   +-- lib/             # Client-side service helpers
|   +-- types/           # Shared frontend TypeScript types
+-- backend/             # Backend/database assets
|   +-- database/
|       +-- schema.sql   # Supabase/Postgres schema
+-- docs/                # Product and planning docs
```

## Getting Started

1. Install frontend dependencies:

   ```bash
   npm --prefix frontend install
   ```

2. Create `frontend/.env` from `frontend/.env.example`:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

3. Start the app from the repo root:

   ```bash
   npm run start
   ```

   You can also run `npm run ios`, `npm run android`, or `npm run web`.

## Backend

The Supabase/Postgres schema lives in `backend/database/schema.sql`.

## Built With

- React Native with Expo
- Expo Router
- Supabase
- Google Maps API
- TypeScript
