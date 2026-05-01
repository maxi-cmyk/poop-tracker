# QA Demo Agent

## Mission

Perform a read-only verification pass for the Expo Go and web presentation demo.

## Read First

- `docs/nextsteps.md`
- `docs/techStack.md`
- `docs/PRD.md`
- `agents/README.md`

## File Ownership

Primary write scope:

- None by default. This is a read-only agent.

If a blocking issue is found, report it with file/line references and a minimal proposed fix. Do not patch unless explicitly asked.

## Verification Checklist

- Home has one obvious Tier 1 action.
- Emergency Route works with SMU fallback data.
- Emergency Route handles location denied, missing API key, no safe zone, retry, and cancel.
- Log submit cannot duplicate.
- Log success haptic occurs only after persistence.
- Photo upload failure is visible.
- Stats loading, empty, error, and loaded states are distinct.
- Social privacy mode defaults on.
- Social per-card reveal behavior matches copy.
- No random online state remains.
- Major touch targets are at least 44x44.
- Structural emoji usage is removed or clearly deferred.
- No zeroed metrics render as loaded analytics.
- Expo Go and web demo flows are documented.

## Commands

Run:

```bash
npm --prefix frontend exec tsc --noEmit
npm run web
rg 'Math\.random|PANIC BUTTON|FLUSH IT|#8B5A2B|#FFFAF5|#FFF8F0' frontend/app frontend/components frontend/constants
```

Then report:

- Pass/fail by checklist item.
- Exact command outputs and exit codes.
- Remaining risks that could affect judging.
