---
name: poopals-design
description: UI/UX and aesthetic direction for the PooPals Expo React Native app.
---

# PooPals Design Direction

PooPals should look like a prestigious, heavily funded medical wellness startup that happens to track bowel movements. The joke works because the interface takes itself completely seriously: dark mode, precise data displays, polished health-tech surfaces, calm typography, restrained icons, and clinically worded feedback.

Think Apple Health, Oura, Whoop, Arc browser settings, and a private gastroenterology dashboard. Do not make the app visually silly, brown, cartoonish, or emoji-led.

## Product Context

This repo is an Expo React Native app in `frontend/` with Supabase-backed logs, achievements, streaks, social sharing, toilet venue data, and monthly reports.

Primary screens:

- `frontend/app/(tabs)/index.tsx`: home dashboard, urgent session entry, daily metrics.
- `frontend/app/(tabs)/log.tsx`: session timer and structured bowel log form.
- `frontend/app/(tabs)/stats.tsx`: trends, health score, Bristol distribution, timing analytics.
- `frontend/app/(tabs)/map.tsx`: nearby toilet finder and venue quality.
- `frontend/app/(tabs)/social.tsx`: privacy-first social feed, leaderboards, friends.
- `frontend/app/achievements.tsx`: badge/progress system.
- `frontend/app/monthly-report.tsx`: shareable health-style monthly report.

Core reusable UI components:

- `frontend/components/PanicButton.tsx`
- `frontend/components/SessionTimer.tsx`
- `frontend/components/BristolScale.tsx`
- `frontend/components/VolumeSelector.tsx`
- `frontend/components/ColorPicker.tsx`
- `frontend/components/PhotoCapture.tsx`

## Aesthetic Positioning

### The "Overly Serious" Medical Startup

The app should present absurd subject matter with the confidence of a serious personal health product.

- Treat every bowel event as a biometric record.
- Present funny concepts as clinical, data-rich, and polished.
- Keep the humor in labels, achievement names, and tiny moments of copy, not in the visual design.
- Use premium health language: session, log, baseline, trend, consistency, regularity, recovery, privacy, signal, insight.
- Avoid visual gags: no poop-shaped buttons, no brown palette, no oversized emojis, no cartoon badges.

### Visual Keywords

- Dark-first
- Clinical
- Premium
- Quiet
- Data-dense
- Private
- Calm
- Minimal
- Slightly futuristic
- Straight-faced

## Design Principles

### 1. Data First, Joke Second

Every screen should make the user feel like they are reviewing meaningful health telemetry. Humor is a secondary layer.

Good:

- "Regularity Score"
- "Bristol Baseline"
- "Session Recorded"
- "Monthly Digest"
- "Privacy Shield Active"

Avoid:

- "Poop party"
- "Big dump energy"
- "Tap the turd"
- Anything that makes the UI feel like a novelty app.

### 2. Dark Mode Is The Default Product Identity

The app should feel native in dark mode. Light mode can exist, but should read as secondary.

- Dark surfaces are graphite and black-green, not brown.
- Accent colors are medical mint, oxygen cyan, and calibrated amber/red for status.
- Use subtle gradients only to create depth and focus.
- No beige, tan, orange, espresso, or poop-brown dominant palettes.

### 3. Privacy Is A Core Visual Theme

Because the data is sensitive, the interface should constantly signal discretion.

- Privacy mode should look like a serious security control, not a joke toggle.
- Photo areas should feel like encrypted vault surfaces.
- Social content should default to blurred, anonymized, and permissioned.
- Use lock, shield, eye-off, and fingerprint-style iconography when appropriate.

### 4. Clinical Calm Over Playful Chaos

The current app uses many emojis and warm brown surfaces. Replace that with restrained iconography and measured type.

- Use FontAwesome or another consistent vector icon set.
- Use emoji only as rare content inside achievements or share text.
- Primary navigation must use icon plus text, with clear selected state.
- Numbers should use tabular figures.

## Color System

Put shared tokens in `frontend/constants/Colors.ts` and consume them across screens/components. Avoid hardcoded raw hex values in individual screen styles once the redesign starts.

### Dark Theme Tokens

```ts
export const palette = {
  bg: "#080A0C",
  bgElevated: "#0E1215",
  surface: "#11171B",
  surfaceRaised: "#171F24",
  surfaceInset: "#07090B",
  border: "#263139",
  borderStrong: "#39464F",

  textPrimary: "#F5F7F6",
  textSecondary: "#A9B4B0",
  textTertiary: "#6F7A78",

  accent: "#78F2C4",
  accentSoft: "#1E3B34",
  accentCyan: "#8BDCFB",
  accentViolet: "#B7A7FF",

  success: "#72E6A6",
  warning: "#F3C969",
  danger: "#FF6472",
  info: "#8BDCFB",
};
```

### Light Theme Tokens

Light mode should still feel clinical, not cute.

```ts
export const lightPalette = {
  bg: "#F6F8F7",
  surface: "#FFFFFF",
  surfaceRaised: "#FDFEFE",
  border: "#DCE4E1",
  textPrimary: "#111817",
  textSecondary: "#566360",
  accent: "#0E8F70",
  accentSoft: "#DDF7EF",
};
```

### Semantic Use

- `accent`: selected states, primary CTAs, ideal Bristol type, active timer.
- `success`: healthy/optimal insight.
- `warning`: mild health concern, missing data, caution.
- `danger`: medical warning, destructive action, stop timer.
- `info`: maps, venue metadata, location permission states.
- `accentViolet`: achievements only, used sparingly.

Do not use brown as a brand color. If the subject matter needs a stool color representation, isolate it inside the color picker swatches only.

## Typography

Use system sans-serif typography for a native health-tech feel.

- Primary font: React Native system font.
- Numeric/timer font: `SpaceMono-Regular` or tabular figures only for timers, scores, and chart labels.
- Display titles: 28-34, weight 700.
- Section titles: 18-22, weight 650-700.
- Body: 15-16, weight 400-500.
- Metadata labels: 11-13, uppercase optional, letter spacing no more than 0.5.
- Avoid negative letter spacing.

Tone should be crisp and institutional:

- "Begin Session"
- "End Session"
- "Record Log"
- "Health Insight"
- "Private by Default"
- "Session archived"

## Shape, Depth, And Neumorphism

Use a subtle dark neumorphic style. The UI should feel machined and expensive, not bubbly.

- App background: dark gradient or solid `bg`.
- Main surfaces: `surface` with 1px border and low-contrast highlight.
- Cards: 8px radius by default.
- Large biometric modules and circular timer controls may use 24px or full radius when the shape communicates function.
- Buttons: pill shape allowed for primary CTAs and timer actions.
- Shadows: soft dual shadows, not heavy black drop shadows.
- Inset controls: use darker inset surface for selected/input states.

React Native shadow guidance:

```ts
shadowColor: "#000",
shadowOffset: { width: 0, height: 12 },
shadowOpacity: 0.24,
shadowRadius: 24,
elevation: 8,
```

For inset-looking controls, combine darker fill, subtle top border, and selected glow rather than relying on unsupported inset shadows.

## Iconography

Use vector icons instead of emojis for interface chrome.

Recommended icon meanings:

- Home: activity, heart pulse, or dashboard.
- Log: plus circle, clipboard pulse, or timer.
- Stats: chart line or activity.
- Map: map pin.
- Social: users or shield-users.
- Privacy: lock, shield, eye-off.
- Achievements: medal, award, or badge.
- Photos: camera or image.
- Health warning: alert triangle.

Emoji exceptions:

- Share text output may include playful emoji.
- Achievement definitions may retain a small emoji if converted later to icons is out of scope.
- Do not use emoji as primary button labels, tab labels, section headings, or card focal points.

## Screen Direction

### Home Dashboard

Purpose: one-glance biometric status and fastest path to logging.

Hierarchy:

1. Today status: streak, today logs, regularity score.
2. Primary action: urgent/begin session button.
3. Key metrics: total time, average Bristol, achievements, venues.
4. Health insight.

Replace the current warm welcome and emoji stat cards with a dark biometric dashboard. The "panic button" should become a premium emergency session control:

- Label: "Begin Urgent Session" or "Start Session".
- Shape: large pill or circular biometric control.
- Visual: graphite surface with mint pulse ring.
- Haptic: strong impact on press.
- Avoid: poop emoji, brown fill, all-caps joke styling.

### Log Screen

Purpose: collect a complete structured log with minimum friction.

The screen should feel like a guided clinical intake form.

- Timer sits at top as the active biometric module.
- Bristol Scale becomes compact selectable clinical tiles.
- Ideal type should use a mint outline/glow.
- Color picker should use realistic swatches with label and warning state.
- Volume selector should use segmented controls or small ranked capsules.
- Photo capture should be framed as "Private Photo Vault".
- Social sharing toggle defaults off and reads as a privacy/security choice.
- Submit CTA: "Record Session" or "Archive Log".

Warnings for black/red/white stool should look serious and medically cautious. Avoid comic warning copy.

### Stats Screen

Purpose: turn logs into credible health intelligence.

Use dashboard analytics patterns:

- Top health score or consistency score as the lead metric.
- Total logs and throne time are secondary.
- Bristol distribution chart should be clean, labeled, and color accessible.
- Time-of-day distribution should be a small heatmap or four-cell rhythm chart.
- Trends should use restrained chart colors, not emoji labels.
- Use empty states if no logs exist yet.

### Map Screen

Purpose: find high-quality restrooms quickly.

Direction:

- Dark map chrome if possible.
- Venue cards should look like quality ratings, not novelty listings.
- Use icons for bidet, cleanliness, privacy, and paper quality.
- Primary action: navigate or log at venue.
- Location permission states should be calm and clear.

### Social Screen

Purpose: private, opt-in community without making sensitive content feel exposed.

Direction:

- Default state: privacy mode active.
- The privacy bar should look like a security banner.
- Feed cards should use anonymized names and blurred media by default.
- Leaderboards should look like fitness benchmarks.
- Friend cards should show streak/online state in a restrained way.
- Reactions should be subtle, not emoji-heavy.

Suggested labels:

- "Private Feed"
- "Benchmarks"
- "Circle"
- "Privacy Shield Active"
- "Reveal Temporarily"

### Achievements

Purpose: reward behavior while staying visually premium.

Direction:

- Treat achievements like clinical milestone badges.
- Locked badges should be subdued graphite tiles.
- Unlocked badges should use metallic mint/violet accents.
- Progress header should be a clean meter, not a gold cartoon banner.
- Share button copy: "Share Progress".

### Monthly Report

Purpose: an Oura-style digest users might actually share.

Direction:

- Header: month, score, one-line insight.
- Health score is the hero with circular/ring treatment.
- Stats grid uses clean metric tiles.
- Alerts use medical status colors and plain language.
- Share asset should feel like a premium health report, not a meme card.

## Component Rules

### Buttons

- Minimum touch target: 44x44.
- Primary buttons: mint accent on dark or dark surface with mint border/glow.
- Destructive/stop actions: danger red, used sparingly.
- Disabled state: visible reduction in contrast plus disabled behavior.
- Include loading state for async submit/photo upload.

### Cards And Metric Tiles

- Use cards only for distinct metrics or actions.
- Avoid cards inside cards.
- Keep density high enough for repeated daily use.
- Each metric tile needs label, value, optional delta/status.
- Values should be larger than labels and use tabular figures when numeric.

### Forms

- Labels are always visible.
- Helper text is allowed for medical/health clarity.
- Avoid placeholder-only inputs.
- Error messages appear near the field or action that caused them.
- Required selections should show a clear missing state before submit.

### Charts

- Charts must include numeric labels or legends.
- Do not rely on color alone.
- Highlight the ideal Bristol range with accent, not green-only meaning.
- Empty chart areas need first-run empty states.

### Photos

- Default to private.
- Blur sensitive imagery in social contexts.
- Use explicit labels for "Toilet photo" vs "Log photo".
- Do not display sensitive image thumbnails in public/social surfaces unless privacy mode is off.

## Motion And Haptics

Motion should feel like a health device, not a game.

- Use 150-300ms transitions.
- Animate transform and opacity only.
- Timer can pulse subtly while active.
- Press states should respond immediately.
- Haptics are appropriate for start, stop, submit success, and serious warning confirmation.
- Do not use constant bouncing, wobbling, or decorative motion.

## Copy Tone

Use deadpan clinical humor.

Avoid:

- "Session archived."
- "Consistency improved this week."
- "Bristol baseline is stable."
- "Private by default."
- "Atypical color detected. Monitor if persistent."

Use:

- "Yay! Poop saved!"
- "Flush it!"
- "Nice dump!"
- "Mystery pooper party... Might wanna check it out!"

The brand name PooPals can remain playful. The interface surrounding it should behave like a serious medical companion.

## Accessibility And Safety

- Maintain WCAG AA contrast for all text.
- Support system text scaling without clipped labels.
- Avoid color-only meaning for health status.
- Keep touch targets at least 44x44.
- Health warnings should clearly recommend consulting a healthcare provider when appropriate.
- Avoid presenting scores as diagnosis. Use "insight", "pattern", and "trend", not "diagnosis".

## Implementation Priorities

When converting the current UI, work in this order:

1. Centralize theme tokens in `frontend/constants/Colors.ts`.
2. Update tab bar and headers in `frontend/app/(tabs)/_layout.tsx`.
3. Restyle `PanicButton`, `SessionTimer`, and shared selector components.
4. Convert screen backgrounds, cards, and text styles from warm beige/brown to dark clinical tokens.
5. Replace emoji-led interface labels with vector icons and serious copy.
6. Add empty/loading/error states where Supabase data can be missing.
7. Audit all hardcoded colors with `rg '#[0-9A-Fa-f]{6}' frontend`.

## Explicit Anti-Patterns

- Brown, tan, beige, espresso, or poop-colored brand surfaces.
- Emoji as navigation, CTA, section title, or card hero.
- Cartoon poop icons.
- Oversized rounded cards everywhere.
- Random bright gradients.
- Meme-like copy in core flows.
- Crowded dashboards where every metric has equal weight.
- Social screens that expose sensitive content by default.
- Medical claims that sound diagnostic.

## Acceptance Checklist

- The first impression reads "premium health app", not "joke app".
- Dark mode looks intentional and complete.
- The primary action on each screen is obvious within 3 seconds.
- Humor is present but visually restrained.
- Sensitive content defaults to private.
- Numeric health data is readable, stable, and well-labeled.
- All repeated colors come from shared tokens.
- All interactive controls have pressed, disabled, loading, and error states where applicable.
- The app still feels like PooPals, but the visual language is serious enough that the absurdity lands harder.
