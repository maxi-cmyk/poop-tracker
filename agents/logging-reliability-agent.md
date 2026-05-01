# Logging Reliability Agent

## Mission

Make session logging safe and demo-reliable: no duplicate saves, no premature success haptics, and visible photo/upload/persistence states.

## Read First

- `docs/nextsteps.md`
- `docs/PRD.md`
- `skills/frontend.md`
- `skills/backend.md`
- `frontend/app/(tabs)/log.tsx`
- `frontend/lib/storage.ts`

## File Ownership

Primary write scope:

- `frontend/app/(tabs)/log.tsx`
- `frontend/lib/storage.ts`
- `frontend/components/PhotoCapture.tsx` only for upload/permission/status UX.

Avoid editing:

- Map routing files.
- Stats and Social screens.
- Database schema unless a frontend enum mismatch is discovered.

## Requirements

- Add `isSubmitting` or equivalent submit lock.
- Disable submit during save/upload.
- Show visible saving, success, error, and retry states.
- Fire success haptics only after Supabase insert and streak update succeed.
- Surface photo upload failures; do not silently continue with `null` URLs when the user selected a photo.
- Keep required fields obvious: Bristol type, volume, color.
- Keep sharing default private and explicit.
- Use cautionary, non-diagnostic warning copy for black/red/white color selections.

## Constraints

- Do not build full offline sync.
- Do not implement AI photo classification.
- Do not migrate to production private signed storage in this slice.
- Do not add noisy haptics for every field tap.

## Validation

Run:

```bash
npm --prefix frontend exec tsc --noEmit
```

Smoke test incomplete required fields, duplicate tap prevention, selected photo upload failure, unauthenticated user, and successful save.
