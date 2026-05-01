---
name: poopals-frontend
description: Frontend implementation guidance for the PooPals Expo React Native app.
---

# PooPals Frontend Practices

This repo's frontend is an Expo React Native app under `frontend/`. It uses Expo Router, TypeScript, Supabase JS, React Native Maps, Expo Location, Expo Image Picker, Expo Haptics, and shared domain types in `frontend/types`.

Use this skill when changing app screens, shared components, navigation, styling, copy, or client-side Supabase interactions.

## Project Structure

```text
frontend/
  app/                 Expo Router routes and layouts
    (tabs)/            Main tab screens: Home, Log, Stats, Map, Social
    achievements.tsx   Achievement progress screen
    monthly-report.tsx Monthly digest screen
  components/          Reusable React Native UI components
  constants/           Theme/color constants
  lib/                 Supabase and storage helpers
  types/               Domain interfaces and value dictionaries
  assets/              Fonts and app images
```

Keep the app organized around this structure. Do not introduce Next.js, Tailwind, shadcn, web-only DOM patterns, or route-handler conventions.

## Commands

Run commands from the repo root unless there is a specific reason to `cd frontend`.

```bash
npm --prefix frontend install
npm run start
npm run ios
npm run android
npm run web
```

Environment variables belong in `frontend/.env`, using `frontend/.env.example` as the template.

## Design Source Of Truth

Use `skills/design.md` for visual direction. PooPals should look like an overly serious premium health app, not a brown novelty app.

Frontend implementation rules:

- Dark mode should be the primary design target.
- Centralize repeated colors in `frontend/constants/Colors.ts`.
- Use vector icons from `@expo/vector-icons`; avoid emoji as primary interface chrome.
- Keep humor in copy and achievements, not in layout, color, or controls.
- Favor clinical labels: "Begin Session", "Record Log", "Health Insight", "Privacy Shield Active".
- Maintain at least 44x44 touch targets and clear pressed/disabled states.

## TypeScript Standards

Use strict TypeScript. Avoid `any` except when an external SDK response is genuinely untyped and narrowed immediately.

Preferred patterns:

- Use domain types from `frontend/types/index.ts` for `PoopLog`, `Venue`, `VenueReview`, `Profile`, `Friendship`, `Achievement`, `Streak`, and `MonthlyStats`.
- Keep local screen-only types near the screen only when they are not shared.
- For Supabase responses, map raw rows into typed UI view models before rendering.
- Do not duplicate domain interfaces in screens if an equivalent type already exists in `frontend/types`.

## Routing And Navigation

This app uses Expo Router.

- Main tabs live in `frontend/app/(tabs)/`.
- Stack routes such as achievements and monthly report live in `frontend/app/`.
- Tab configuration belongs in `frontend/app/(tabs)/_layout.tsx`.
- Keep tab labels short and stable: Home, Log, Stats, Map, Social.
- Use route pushes from `useRouter()` for app routes.
- Preserve predictable back behavior for stack screens.

## State And Data Fetching

Keep local screen state simple with React hooks unless state is shared across multiple unrelated screens.

Current Supabase access pattern:

- Client is defined in `frontend/lib/supabase.ts`.
- Auth session persists through `AsyncStorage`.
- Use `supabase.auth.getUser()` before user-scoped reads/writes.
- Photo uploads go through `frontend/lib/storage.ts`.

Data fetching rules:

- Every async fetch needs a visible loading or refreshing state.
- Every fetch path needs an empty state and an error state.
- Do not leave `loading` state unused in render logic.
- Avoid firing multiple serial Supabase calls in loops when a join or batched query is reasonable.
- Keep optimistic UI for simple toggles only when rollback is obvious.

## Screen-Specific Guidance

### Home

Primary job: show today's biometric status and get the user into a session fast.

- Tier 1 action is session start.
- Streak, today logs, average Bristol, and total time are secondary metrics.
- Achievements and monthly report are secondary actions and should be visually subdued.
- Health tip should become a health insight card, not a large content block competing with session start.

### Log

Primary job: record a structured bowel session with low friction.

- Timer is the active session module.
- Bristol, volume, color, photos, notes, and sharing are progressive input groups.
- Required fields must be obvious before submit.
- Submit should show disabled, loading, success, and error states.
- Medical color warnings should be plain and serious.
- Sharing must default private and explain exposure clearly.

### Stats

Primary job: convert logs into credible health insight.

- Render skeleton/empty states while loading or when no logs exist.
- Charts need labels and should not rely on color alone.
- Health score/consistency score should be the lead metric if present.
- Use tabular numbers for durations and counts.

### Map

Primary job: find nearby restrooms quickly.

- Location permission states must be clear and recoverable.
- Search should show loading inline, not only via console/alert.
- Venue quality should use consistent iconography and accessible labels.
- Empty results should provide a next action.

### Social

Primary job: private, opt-in community.

- Privacy mode is always default-on.
- Feed images/content should stay blurred until explicitly revealed.
- Tabs should be clear, not emoji-led.
- Loading and empty states are required for feed, friends, and leaderboards.

## Component Standards

### Buttons And Pressables

- Use `TouchableOpacity` or platform-appropriate Pressable with `accessibilityRole="button"`.
- Provide `accessibilityLabel` when label text is not enough.
- Minimum hit area is 44x44.
- Use `activeOpacity` or pressed state consistently.
- Async buttons must disable during submit/upload and show progress.

### Form Controls

- Visible labels are required.
- Placeholder text is supplemental, not the only label.
- Errors appear near the control or submit action.
- Required choices should be visually marked before submission.
- Toggles need label, current state, and clear consequence.

### Cards And Metrics

- Use cards for distinct metrics or actions only.
- Avoid nested cards.
- Values are visually dominant; labels are secondary.
- Use shared spacing and color tokens.
- Prefer compact, scannable layout for repeated daily use.

### Photos

- Treat photos as sensitive health data.
- Do not expose sensitive thumbnails in social contexts by default.
- Upload progress and failure should be visible.
- Never assume the public storage URL is safe just because upload succeeded.

## Accessibility

- Add `accessibilityRole`, `accessibilityLabel`, and hints where helpful.
- Keep text readable under system text scaling.
- Do not encode status by color alone.
- Use semantic text for health warnings.
- Keep primary navigation labeled.

## Testing And Verification

Before finishing frontend changes:

1. Run a TypeScript check when dependencies are installed.
2. Start Expo and smoke test the touched screen.
3. Check small mobile widths for text clipping and overcrowded controls.
4. Verify dark mode and light mode if both are supported.
5. Search for raw color drift with `rg '#[0-9A-Fa-f]{6}' frontend`.

If dependencies are not installed, say that clearly and run lighter static checks where possible.
