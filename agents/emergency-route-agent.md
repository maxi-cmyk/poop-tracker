# Emergency Route Agent

## Mission

Build the SMU Tactical Evacuation demo: Home emergency action to map route state, nearest safe-zone selection, and clear recovery states.

## Read First

- `docs/nextsteps.md`
- `docs/PRD.md`
- `docs/techStack.md`
- `skills/frontend.md`
- `skills/design.md`

## File Ownership

Primary write scope:

- `frontend/app/(tabs)/map.tsx`
- `frontend/components/PanicButton.tsx`
- `frontend/app/(tabs)/index.tsx`
- `frontend/lib/safeZones.ts`

Avoid editing:

- `backend/database/schema.sql`
- `backend/database/seed.sql`
- Log, Stats, and Social screens unless routing integration requires a tiny change.

## Requirements

- Make `PanicButton.tsx` a clinical "Begin Urgent Session" / "Emergency Route" control.
- Route Home emergency activation directly into map Tactical Evacuation Mode.
- Add SMU local fallback safe-zone data if `frontend/lib/safeZones.ts` does not exist.
- Use Supabase-seeded `venues` when available, with local fallback if fetch fails.
- Filter candidate restrooms to a 700m maximum radius from user location or SMU demo origin.
- Calculate distance client-side with Haversine.
- Show ETA, distance, confidence/status, route calculating, permission denied, API key missing, no safe zone, retry, and cancel states.
- Keep map overlays lightweight and usable in Expo Go.

## Constraints

- Do not add PostGIS.
- Do not add OSM ingestion.
- Do not add a custom backend.
- Do not block the demo on Google Places availability.
- Do not let the route UI become a blank map during loading or error states.

## Validation

Run:

```bash
npm --prefix frontend exec tsc --noEmit
npm run web
```

Smoke test Home -> Emergency Route, location denied fallback, missing API key handling, and no-safe-zone state.
