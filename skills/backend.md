---
name: poopals-backend
description: Backend and Supabase guidance for the PooPals Expo React Native app.
---

# PooPals Backend Practices

This repo's backend is currently Supabase/Postgres, not a custom Node, Python, or Next.js API. Backend assets live in `backend/`, with the primary schema at `backend/database/schema.sql`. The Expo app talks to Supabase from `frontend/lib/supabase.ts` and uploads photos from `frontend/lib/storage.ts`.

Use this skill when changing the database schema, Row Level Security policies, storage rules, Supabase data access patterns, or backend-facing frontend code.

## Current Backend Shape

```text
backend/
  database/
    schema.sql       Tables, constraints, RLS policies, auth trigger notes

frontend/lib/
  supabase.ts        Supabase client and user/profile helpers
  storage.ts         Photo upload helper for the poop-photos bucket
```

Core tables:

- `profiles`: user profile metadata linked to `auth.users`.
- `poop_logs`: main session/log records.
- `venues`: toilet venue locations.
- `venue_reviews`: user ratings for venues.
- `friendships`: social graph and request status.
- `user_achievements`: unlocked achievement records.
- `streaks`: current/longest streak state.

## Supabase Is The Backend Boundary

Do not add a separate API server unless the feature clearly needs trusted server-side logic that cannot live in Supabase policies, triggers, Edge Functions, or client-safe calls.

Preferred order:

1. Postgres constraints for data validity.
2. RLS policies for authorization.
3. SQL functions/triggers for database-side invariants.
4. Supabase Edge Functions for privileged operations.
5. Custom server only if the above are insufficient.

## Schema Conventions

- Use `snake_case` table and column names.
- Use UUID primary keys for app-created rows.
- Always include `created_at` on user-created entities.
- Use check constraints for bounded enums like Bristol type, volume, friendship status, and health alert categories.
- Keep health data user-scoped by default.
- Add indexes when a screen queries by `user_id`, `logged_at`, location, or relationship status.
- Prefer additive migrations over destructive edits once real data exists.

When updating `backend/database/schema.sql`, keep related changes together:

1. Table/column changes.
2. Constraints and indexes.
3. RLS enablement.
4. Policies.
5. Triggers/functions.
6. Storage notes.

## Security And Privacy Rules

PooPals stores sensitive health-adjacent data. Default private.

- `poop_logs.is_public` must default to `false`.
- Users can manage only their own logs, streaks, reviews, friendships, and achievements unless a policy explicitly allows comparison/social reads.
- Public/social reads must respect accepted friendships where possible.
- Never expose sensitive photo URLs unless the user opted into sharing and the UI privacy mode supports it.
- Do not put Supabase service role keys in Expo code or `EXPO_PUBLIC_*` variables.
- Use `supabase.auth.getUser()` for trusted current-user checks from the client.

## RLS Policy Guidance

Every table containing user data needs RLS enabled.

Policy checklist:

- `profiles`: public read is acceptable only for non-sensitive profile fields; user updates own profile.
- `poop_logs`: owner CRUD; public/friend select only when `is_public = true` and relationship permits.
- `venues`: public read; authenticated insert.
- `venue_reviews`: public read; owner manage.
- `friendships`: only participants can read/manage.
- `user_achievements`: comparison reads can be public, but writes must be owner-only.
- `streaks`: owner-only.

When adding a new table, add RLS in the same change. A table without RLS is not complete.

## Storage Guidance

Current bucket note: `poop-photos`.

Photos are sensitive. Prefer a private bucket with signed URLs for any production path. If public URLs remain during prototyping, make the privacy tradeoff explicit in code comments and docs.

Storage rules:

- Path photos by user id, e.g. `${userId}/${timestamp}_${type}.jpg`.
- Validate ownership through storage policies.
- Do not trust file names or MIME type from the client alone.
- Surface upload failure to the user; returning `null` silently is not enough for a complete UX.
- Consider separate buckets or prefixes for toilet venue photos versus sensitive log photos.

## Data Access From Frontend

Keep Supabase query logic in `frontend/lib/` when reused. Screen-local queries are acceptable for narrow one-off reads, but shared logic should move out of screen files.

Preferred pattern:

```ts
const {
  data: { user },
  error: userError,
} = await supabase.auth.getUser();

if (userError || !user) {
  throw new Error("You must be signed in.");
}
```

Query guidance:

- Always handle `error`.
- Prefer explicit column selection.
- Use `.maybeSingle()` when a missing row is expected.
- Avoid N+1 queries in loops; use joins or batched queries.
- Keep UI view-model mapping separate from persistence shape.

## Domain Invariants

Backend and frontend should agree on these rules:

- Bristol type is 1 through 7.
- Volume is `small`, `medium`, `large`, or `massive`.
- Stool color values should match `frontend/types/index.ts`.
- Health warning colors include black, red, and white.
- Streak updates must not double-count multiple logs on the same day.
- Friendship status is `pending`, `accepted`, or `rejected`.
- Venue reviews are unique per venue/user.

If the frontend adds a new enum value, update the database constraint in the same change.

## Health And Safety Copy

The backend can store insights, but the product should not claim diagnosis.

Use:

- "pattern"
- "trend"
- "insight"
- "monitor if persistent"
- "consider consulting a healthcare provider"

Avoid:

- "diagnosis"
- "disease detected"
- "you have"
- anything that sounds like medical certainty.

## Operational Checklist

Before shipping backend changes:

- Schema applies cleanly to a fresh Supabase project.
- RLS is enabled for every user-data table.
- Policies cover owner read/write and social read cases.
- Storage bucket privacy matches the frontend promise.
- The Expo client uses only anon/public env vars.
- Existing frontend types still match database enum values.
- Seed/demo data exists for dashboard, stats, map, social, achievements, and monthly report flows when needed.

## Known Current Risks To Watch

- Photo storage is documented as public; this conflicts with the app's sensitive-data positioning.
- Some frontend screens query Supabase directly and duplicate mapping logic.
- Streak updates are currently simplified in the client and can drift from true consecutive-day logic.
- Social feed behavior should be audited against the RLS friendship policy before relying on public/friend visibility.
