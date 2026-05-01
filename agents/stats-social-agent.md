# Stats And Social Agent

## Mission

Make analytics and social surfaces trustworthy: visible data states, low-confidence forecast messaging, and privacy-correct feed reveal behavior.

## Read First

- `docs/nextsteps.md`
- `docs/PRD.md`
- `skills/frontend.md`
- `skills/design.md`
- `frontend/app/(tabs)/stats.tsx`
- `frontend/app/(tabs)/social.tsx`

## File Ownership

Primary write scope:

- `frontend/app/(tabs)/stats.tsx`
- `frontend/app/(tabs)/social.tsx`
- `frontend/app/monthly-report.tsx` only if forecast/monthly copy needs a small aligned update.

Avoid editing:

- Log submission files.
- Map route files.
- Backend seed files unless demo data assumptions need to be documented for the seed agent.

## Requirements

Stats:

- Show loading before metrics render.
- Show empty state when there are no logs.
- Show error state with retry when Supabase fetch fails.
- Never show zeroed analytics as real loaded data.
- Add a simple time-of-day or interval-based forecast panel if feasible.
- Label forecasts under 30 logs as low-confidence pattern analysis, not prediction certainty.

Social:

- Keep privacy mode default-on.
- Make per-card "tap to reveal" actually reveal that card, or change copy to match behavior.
- Remove `Math.random()` online status; use deterministic demo data or hide online state.
- Add loading, empty, error, and retry states for feed, friends, and leaderboards.
- Keep sensitive content blurred or anonymized by default.

## Constraints

- Do not add push notifications.
- Do not make medical claims.
- Do not expose sensitive photo URLs by default.
- Do not add backend social features beyond current Supabase reads.

## Validation

Run:

```bash
npm --prefix frontend exec tsc --noEmit
```

Smoke test no logs, Supabase error, social empty feed, per-card reveal, and privacy mode toggling.
