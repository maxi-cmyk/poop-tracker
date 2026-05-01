# PooPals Agent Briefs

Use these briefs to split hackathon work into focused agents without losing alignment on scope, design, or verification.

## Current Build Goal

Ship the SMU hackathon slice:

- Expo Go-compatible PooPals demo.
- Dark clinical UI, not brown novelty styling.
- Supabase database plus seed data only.
- SMU restroom/safe-zone demo within a 700m radius.
- Client-side Haversine filtering, with local fallback safe zones.
- Reliable visible states: loading, empty, saving, success, error, retry.
- Privacy-correct social feed and photo behavior.

## Source Of Truth

Agents should read these before editing:

- `docs/nextsteps.md`
- `docs/PRD.md`
- `docs/techStack.md`
- `skills/design.md`
- `skills/frontend.md`
- `skills/backend.md`

## Recommended Execution Order

1. Run `backend-seed-agent.md` and `theme-foundation-agent.md` first.
2. Run `emergency-route-agent.md`, `logging-reliability-agent.md`, and `stats-social-agent.md` in parallel after the foundation pass.
3. Run `qa-demo-agent.md` last as a read-only verification pass.

## Coordination Rules

- You are not alone in the codebase. Do not revert edits made by other agents.
- Stay inside your file ownership unless you clearly document why a small cross-file edit is needed.
- Use existing Expo Router, React Native, TypeScript, and Supabase patterns.
- Do not add a custom backend, PostGIS, OSM ingestion, push notifications, AI classification, or full offline sync for this hackathon slice.
- Prefer small, reviewable changes over broad rewrites.
- Keep user-facing copy clinical and deadpan.
- Use `@expo/vector-icons` for UI chrome; avoid emoji as primary navigation, buttons, or section headings.
- Treat photos and social content as sensitive by default.

## Standard Handoff

Each agent should end with:

```text
Changed files:
- path/to/file

What changed:
- ...

Validation:
- Command: ...
- Result: ...

Known risks / follow-ups:
- ...
```

## Verification Baseline

Run what is relevant for the files touched:

```bash
npm --prefix frontend exec tsc --noEmit
npm run web
```

For docs-only work, read back the changed sections and use `git diff -- <files>`.
