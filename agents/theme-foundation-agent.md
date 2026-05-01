# Theme Foundation Agent

## Mission

Convert the app's first impression from brown novelty UI to dark clinical health-tech UI using shared tokens.

## Read First

- `skills/design.md`
- `skills/frontend.md`
- `docs/PRD.md`
- `docs/nextsteps.md`
- `docs/techStack.md`

## File Ownership

Primary write scope:

- `frontend/constants/Colors.ts`
- `frontend/app/_layout.tsx`
- `frontend/app/(tabs)/_layout.tsx`
- Shared style-only edits in `frontend/components/PanicButton.tsx`, `frontend/components/SessionTimer.tsx`, `frontend/components/BristolScale.tsx`, `frontend/components/VolumeSelector.tsx`, `frontend/components/ColorPicker.tsx`, and `frontend/components/PhotoCapture.tsx`

Coordinate before editing:

- `frontend/app/(tabs)/index.tsx`
- `frontend/app/(tabs)/log.tsx`
- `frontend/app/(tabs)/map.tsx`
- `frontend/app/(tabs)/stats.tsx`
- `frontend/app/(tabs)/social.tsx`

## Requirements

- Centralize dark clinical tokens in `frontend/constants/Colors.ts`.
- Update stack headers and tab bar styling to use dark graphite, mint, cyan, and status colors.
- Replace obvious brown/beige surfaces in shared components.
- Preserve Expo Go compatibility.
- Use vector icons where making small icon swaps; avoid large icon refactors if they risk breaking feature work.
- Add pressed/disabled visual states where the touched components expose interactive controls.

## Constraints

- Do not redesign every screen in one broad pass.
- Do not use brown/tan/beige as brand surfaces.
- Do not introduce Tailwind, shadcn, web-only DOM patterns, or a new UI library.
- Keep cards restrained; avoid nested card styling.

## Validation

Run:

```bash
npm --prefix frontend exec tsc --noEmit
rg '#8B5A2B|#FFFAF5|#FFF8F0|#4A3728|#8B7355' frontend/constants frontend/app frontend/components
```

Report remaining raw legacy colors if any are intentionally deferred.
