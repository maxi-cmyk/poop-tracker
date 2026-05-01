# AGENTS.md

Keep this file short. Use it for operating rules only; put detailed role briefs in `agents/`.

## Project Focus

- Build the SMU hackathon slice for Expo Go and web demo.
- Use Expo React Native, Expo Router, TypeScript, and Supabase.
- Use Supabase database plus seed data for the hackathon backend.
- Do not add PostGIS, OSM ingestion, push notifications, AI classification, full offline sync, or a custom API server unless explicitly requested.

## Source Of Truth

- `docs/nextsteps.md`
- `docs/PRD.md`
- `docs/techStack.md`
- `skills/design.md`
- `skills/frontend.md`
- `skills/backend.md`
- `agents/README.md`

## Subagents

- Use subagents for independent parallel work, especially exploration, implementation slices, and verification.
- Give each subagent clear file ownership and tell it not to revert other agents' edits.
- Prefer the specialized briefs in `agents/`:
  - `backend-seed-agent.md`
  - `theme-foundation-agent.md`
  - `emergency-route-agent.md`
  - `logging-reliability-agent.md`
  - `stats-social-agent.md`
  - `qa-demo-agent.md`
- In Agent HQ, map those briefs to specialized roles such as Project Manager, Frontend UI Engineer, Backend/Supabase Engineer, and QA Engineer.

## Self-Verification

- Before concluding any coding task, run the relevant check:
  - `npm --prefix frontend exec tsc --noEmit`
  - `npm run web` for UI/demo changes when practical
  - `rg 'Math\.random|PANIC BUTTON|FLUSH IT|#8B5A2B|#FFFAF5|#FFF8F0' frontend/app frontend/components frontend/constants` for final UI polish checks
- For docs-only tasks, read back the changed sections and inspect `git diff -- <files>`.
- If a command cannot be run, state why and describe the remaining risk.

## Handoff

Every agent should report:

- Changed files
- What changed
- Validation command and result
- Known risks or follow-ups
