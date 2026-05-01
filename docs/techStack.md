# Tech Stack

PooPals is a small product monorepo with an Expo React Native frontend and a Supabase backend boundary. There is no custom API server in this repo; the mobile app talks directly to Supabase from `frontend/lib/`.

## Repository Shape

```text
.
├── frontend/            # Expo React Native app
│   ├── app/             # Expo Router routes and layouts
│   ├── components/      # Shared React Native UI components
│   ├── constants/       # Theme and app constants
│   ├── lib/             # Supabase and storage helpers
│   ├── types/           # Shared frontend domain types
│   └── assets/          # App images and SpaceMono font
├── backend/             # Supabase/Postgres assets
│   └── database/
│       ├── schema.sql   # Tables, constraints, RLS, trigger notes
│       └── seed.sql     # Optional demo seed data when added
├── docs/                # Product and planning docs
└── skills/              # Project-specific implementation guidance
```

## Runtime Stack

### Frontend

- Expo SDK `~54.0.32`
- React `19.1.0`
- React Native `0.81.5`
- React Native Web `~0.21.0`
- Expo Router `~6.0.22`
- TypeScript `~5.9.2`
- React Navigation via `@react-navigation/native`

The app entry point is `expo-router/entry`, configured in `frontend/package.json`.

### Native And Expo Modules

- `expo-location` for location permission and current GPS coordinates.
- `react-native-maps` for map rendering and venue markers.
- `expo-image-picker` for camera/photo capture.
- `expo-haptics` for tactile feedback.
- `expo-blur` for privacy blur overlays.
- `expo-font` and bundled `SpaceMono-Regular.ttf` for numeric/timer-style UI where needed.
- `expo-secure-store`, `expo-constants`, `expo-linking`, `expo-splash-screen`, `expo-status-bar`, and `expo-web-browser` for Expo app plumbing.

### Backend

- Supabase JS client `@supabase/supabase-js` `^2.91.0`
- Supabase Auth, with session persistence through `@react-native-async-storage/async-storage`
- Supabase Postgres schema in `backend/database/schema.sql`
- Supabase Storage bucket named `poop-photos`

The current backend model is database-first. Prefer Postgres constraints, RLS policies, SQL functions/triggers, or Supabase Edge Functions before introducing any separate API server.

For the hackathon build, Supabase database plus seed data is enough. Do not add PostGIS, OpenStreetMap ingestion, Edge Functions, or a custom API server unless a demo-blocking requirement appears.

## Data Model

Core Postgres tables:

- `profiles`: user profile metadata linked to `auth.users`.
- `poop_logs`: primary session log records.
- `venues`: toilet venue coordinates and metadata.
- `venue_reviews`: per-user venue ratings.
- `friendships`: social graph and request state.
- `user_achievements`: unlocked achievement records.
- `streaks`: current and longest streak state.

RLS is enabled for all user-data tables in `backend/database/schema.sql`. The frontend domain types live in `frontend/types/index.ts` and should stay aligned with database constraints, especially Bristol type, volume, friendship status, and achievement values.

Hackathon seed data should cover:

- SMU-area restroom venues within or near the 700m demo radius.
- Demo `poop_logs` for stats and monthly report screens.
- Demo `streaks` and `user_achievements`.
- Demo social rows using public/friend-visible logs where needed.

If a seed file is added, place it at `backend/database/seed.sql` and keep it idempotent enough for repeated demo resets.

## Client Libraries

- `frontend/lib/supabase.ts` creates the Supabase client, persists auth in AsyncStorage, and exposes user/profile helpers.
- `frontend/lib/storage.ts` uploads local photo files to the `poop-photos` bucket using `expo-file-system` and `base64-arraybuffer`.
- `frontend/lib/achievements.ts` contains achievement-related client logic.

For the SMU emergency route demo, keep the nearest-restroom calculation in the app:

- Fetch seeded `venues` from Supabase when available.
- Keep a local fallback list in `frontend/lib/safeZones.ts` or `frontend/app/(tabs)/map.tsx`.
- Calculate distance client-side with Haversine.
- Filter to a maximum 700m radius from the user's location or SMU demo origin.
- Pick the nearest safe zone and render ETA/distance/status in Tactical Evacuation Mode.

## Routing

The app uses Expo Router.

Top-level tab screens:

- `frontend/app/(tabs)/index.tsx`: Home dashboard.
- `frontend/app/(tabs)/log.tsx`: session logging flow.
- `frontend/app/(tabs)/stats.tsx`: analytics and distributions.
- `frontend/app/(tabs)/map.tsx`: restroom search and map view.
- `frontend/app/(tabs)/social.tsx`: feed, friends, and benchmarks.

Stack routes:

- `frontend/app/achievements.tsx`
- `frontend/app/monthly-report.tsx`
- `frontend/app/+not-found.tsx`

## Environment Variables

Frontend env vars are public Expo variables and belong in `frontend/.env`.

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

Do not put Supabase service-role keys or other privileged secrets in Expo public env vars.

## App Configuration

`frontend/app.config.ts` configures:

- App name: `PooPals`
- Slug: `poopals`
- Scheme: `poopals`
- Portrait orientation
- iOS bundle identifier: `com.poopals.app`
- Android package: `com.poopals.app`
- Metro web bundler with static web output
- Expo Router typed routes experiment
- Google Maps API key wiring for iOS and Android
- Image picker and location permission copy

## Commands

Run from the repo root:

```bash
npm --prefix frontend install
npm run start
npm run ios
npm run android
npm run web
```

Root scripts are thin wrappers around `frontend/package.json`.

Frontend-local equivalents:

```bash
npm --prefix frontend run start
npm --prefix frontend run ios
npm --prefix frontend run android
npm --prefix frontend run web
```

## TypeScript And Quality

- TypeScript is strict via `frontend/tsconfig.json`.
- Path alias `@/*` maps to `frontend/*`.
- There is no explicit lint, test, or typecheck script currently defined in `frontend/package.json`.
- Existing test coverage is minimal; the repo currently includes `frontend/components/__tests__/StyledText-test.js`.

Recommended ad hoc checks:

```bash
npm --prefix frontend exec tsc --noEmit
npm run web
```

## Design Stack

Design guidance lives in:

- `skills/design.md`
- `skills/frontend.md`
- `docs/PRD.md`
- `docs/nextsteps.md`

The intended product direction is dark-first, clinical, privacy-forward, and mobile-first. Use `@expo/vector-icons` for UI chrome and keep emoji out of primary navigation, buttons, and core workflows.

## Current Stack Risks

- Photo storage currently returns public URLs from `poop-photos`; this conflicts with the long-term privacy posture for sensitive health-adjacent imagery.
- Several frontend screens query Supabase directly instead of using shared data access helpers.
- The current schema does not include PostGIS or a safe-zone table; this is acceptable for the hackathon because SMU venues can be seeded in `venues` and filtered client-side.
- The app relies on Expo public env vars, so only anon/public keys are appropriate in client configuration.
- There is no CI, lint script, or package-level typecheck script yet.
