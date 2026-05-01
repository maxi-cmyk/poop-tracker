# Backend Seed Agent

## Mission

Make Supabase enough for the hackathon demo by adding practical seed data and keeping backend scope simple.

## Read First

- `docs/techStack.md`
- `docs/nextsteps.md`
- `backend/README.md`
- `backend/database/schema.sql`
- `skills/backend.md`

## File Ownership

Primary write scope:

- `backend/database/seed.sql`
- `backend/database/schema.sql` only if a seed need exposes a schema mismatch.
- `backend/README.md` only for seed instructions.

Avoid editing:

- Frontend app screens.
- Supabase client code unless schema changes require a frontend contract note.

## Requirements

- Create `backend/database/seed.sql` if it does not exist.
- Seed SMU-area restroom venues into `venues`.
- Seed enough demo `poop_logs`, `streaks`, and `user_achievements` for dashboard, stats, monthly report, and achievements screens.
- Seed public/friend-visible data only when needed for the social demo.
- Keep the seed approach compatible with the current schema and RLS assumptions.
- Make the seed file safe enough to rerun during demo resets, using stable IDs or clear delete/insert blocks.

## Constraints

- Supabase database plus seed data is the hackathon backend.
- Do not add PostGIS.
- Do not add OSM ingestion.
- Do not add Edge Functions.
- Do not add a custom API server.
- Do not put service-role keys in Expo env vars.

## Validation

Run or inspect:

```bash
sed -n '1,260p' backend/database/seed.sql
```

If local Supabase tooling is unavailable, report that the SQL was statically reviewed but not applied.
