# Backend

Backend assets for PooPals.

## Structure

```text
database/
  schema.sql   Supabase/Postgres schema
  seed.sql     Optional hackathon/demo seed data when added
```

Apply `database/schema.sql` to the Supabase project when provisioning or resetting the database.

## Hackathon Backend Scope

For the hackathon build, Supabase database plus seed data is enough. Do not add a custom API server, PostGIS, OpenStreetMap ingestion, or Supabase Edge Functions unless a demo-blocking requirement appears.

Recommended seed data:

- SMU-area restroom venues in `venues`.
- Demo `poop_logs` for stats and monthly report screens.
- Demo `streaks` and `user_achievements`.
- Public/friend-visible demo logs for the social feed.

Emergency routing can fetch seeded `venues` from Supabase, then calculate nearest restrooms in the Expo app with a client-side Haversine distance helper and a 700m maximum radius. Keep local fallback safe-zone data in the frontend so Tactical Mode still works if Supabase or network access fails during judging.
