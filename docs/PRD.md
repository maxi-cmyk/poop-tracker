# Product Requirements Document: Project PooPals

## 1. Executive Summary

The current market for physiological tracking software lacks the mathematical rigor, operational seriousness, and tactical urgency required for optimal bowel movement intelligence. Project PooPals addresses this critical logistics failure by transforming PooPals into a premium, clinical-grade mobile command center for bowel telemetry.

The application will provide zero-friction session logging, privacy-first biometric record keeping, emergency restroom routing, statistically disciplined predictive analytics, and competitive social benchmarking. The tone must remain ironically serious: the subject matter is absurd, but the product behaves like a heavily funded medical startup with a regulatory affairs department and a very intense typography system.

Project PooPals is not a diagnostic medical product. It surfaces patterns, trends, and user-entered observations. It must never imply clinical certainty.

## 2. Product Positioning

### 2.1 Product Thesis

Users should feel like their bowel movements are being handled by a premium health telemetry system that has secured a large Series B round.

### 2.2 Aesthetic Thesis

The joke lands because the interface is serious.

Required tone:

- Dark-first
- Clinical
- Data-dense
- Minimal
- Privacy-forward
- Smooth and premium
- Calm under biological duress

Forbidden tone:

- Brown novelty app
- Cartoon poop interface
- Emoji-led primary navigation
- Meme-like core workflows
- Fake medical diagnosis

Reference products:

- Apple Health
- Oura
- Whoop
- Arc-style settings surfaces
- Private gastroenterology dashboard

## 3. Core Objectives

1. Establish a high-contrast, zero-friction user interface optimized for single-handed operation during active biological sessions.
2. Convert the current novelty visual language into a serious dark-mode health-tech interface with shared design tokens.
3. Deploy a high-priority evacuation routing protocol that directs users to verified or preselected restroom safe zones under extreme time constraints.
4. Apply statistically disciplined modeling to historical user data to forecast likely future sessions with confidence ranges.
5. Implement a privacy-first social telemetry feed that supports benchmarking without exposing sensitive content by default.
6. Guarantee visible system status across loading, empty, success, error, sync, and offline states.
7. Preserve user control, accessibility, and recovery paths across every high-stakes interaction.

## 4. Current Repo Scope

Frontend:

- `frontend/app/(tabs)/index.tsx`: home dashboard and urgent session entry.
- `frontend/app/(tabs)/log.tsx`: structured session logging flow.
- `frontend/app/(tabs)/stats.tsx`: analytics and distribution views.
- `frontend/app/(tabs)/map.tsx`: restroom search and routing surface.
- `frontend/app/(tabs)/social.tsx`: feed, benchmarks, friends, privacy mode.
- `frontend/app/achievements.tsx`: achievement progress.
- `frontend/app/monthly-report.tsx`: monthly biometric digest.
- `frontend/components/PanicButton.tsx`: urgent session control.
- `frontend/components/SessionTimer.tsx`: active session timing module.
- `frontend/components/BristolScale.tsx`: Bristol type input.
- `frontend/components/VolumeSelector.tsx`: volume input.
- `frontend/components/ColorPicker.tsx`: stool color input.
- `frontend/components/PhotoCapture.tsx`: sensitive photo capture.

Backend:

- `backend/database/schema.sql`: Supabase/Postgres schema, RLS policies, triggers, and storage notes.
- `frontend/lib/supabase.ts`: Supabase client and auth helpers.
- `frontend/lib/storage.ts`: current photo upload helper.

Design and planning:

- `skills/design.md`: visual and interaction design direction.
- `docs/nextsteps.md`: UX heuristic remediation plan.
- `skills/frontend.md`: frontend implementation rules.
- `skills/backend.md`: Supabase/backend rules.

## 5. Foundational UX Requirements

The remediation plan in `docs/nextsteps.md` is mandatory scope for Project PooPals.

### 5.1 System Status

Every async operation must show visible status.

Required states:

- Loading
- Empty
- Error
- Retry
- Saving
- Saved
- Offline queued
- Sync complete

Affected areas:

- Stats loading and empty analytics.
- Social feed, friend, and benchmark loading states.
- Log submission and photo upload.
- Map search and route calculation.
- Background sync.

Acceptance criteria:

- Users never see zeroed analytics before data loading completes.
- Users always know whether an action is pending, complete, failed, or queued.
- Errors include plain-language recovery instructions.

### 5.2 Tier 1 Action Clarity

Each screen must have one obvious Tier 1 action.

Screen-level Tier 1 actions:

- Home: Begin Session or Begin Urgent Session.
- Log: Record Session.
- Stats: Review Health Insight or View Forecast.
- Map: Route to Safe Zone.
- Social: Review Private Feed.
- Achievements: Review Milestone Progress.
- Monthly Report: Share Digest or Review Insight.

Acceptance criteria:

- A first-time user can identify the primary action within 5 seconds.
- Secondary actions are visually quieter than the primary workflow.
- Quick actions do not compete with the active session entry point.

### 5.3 Accessibility And Touch Targets

All interactive controls must be accessible and operable under stress.

Requirements:

- Minimum touch target: 44x44.
- Major interactive clusters should provide generous breathing room; use 48px spacing around critical controls where practical.
- `TouchableOpacity` and equivalent controls must include accessibility roles.
- Icon-only or visually ambiguous controls must include accessibility labels and hints.
- Selected states must not rely on color alone.
- Text must support system scaling without clipping.

### 5.4 Serious Medical Startup Aesthetic

The current brown/beige and emoji-led interface must be replaced.

Requirements:

- Centralize theme tokens in `frontend/constants/Colors.ts`.
- Use dark clinical tokens as the default visual identity.
- Use graphite surfaces, dark green-black backgrounds, mint accents, oxygen cyan information states, and calibrated status colors.
- Remove poop-brown as a brand surface color.
- Use vector icons from `@expo/vector-icons` for interface chrome.
- Keep emoji only in share text or rare achievement flavor, not core UI.

### 5.5 Privacy By Default

Sensitive content must default private.

Requirements:

- Social feed content remains blurred unless explicitly revealed.
- Per-card reveal behavior must match its copy.
- Global privacy mode remains default-on.
- Photo storage and display must be treated as sensitive health-adjacent data.
- Sharing a log must be an explicit opt-in action.

## 6. Feature Specifications

### 6.1 Tactical Evacuation Protocol

Relevant files:

- `frontend/components/PanicButton.tsx`
- `frontend/app/(tabs)/map.tsx`
- `backend/database/schema.sql`

#### 6.1.1 Emergency Override Initialization

The current Panic Button becomes the Emergency Override Control. It must be instantly visible on Home and available as a high-priority action during active sessions.

Requirements:

- Rename visible action to "Begin Urgent Session" or "Emergency Route".
- Remove poop emoji and brown styling from the control.
- Use a premium dark biometric control with a mint or danger-status pulse ring.
- Trigger strong haptic feedback on activation.
- Immediately navigate to the map route state.
- Preserve a clear cancel/exit route.

Acceptance criteria:

- The control is the most visually obvious Home action.
- The user can activate it one-handed.
- The user can cancel the protocol without losing existing log data.

#### 6.1.2 Tactical Map Mode

Upon activation, `map.tsx` enters Tactical Evacuation Mode.

Requirements:

- Use a high-contrast dark map interface.
- Calculate the fastest available pedestrian route to the nearest safe zone.
- Initial implementation may use preloaded or pre-hardcoded safe zones for a test area.
- Hackathon implementation should use Supabase-seeded SMU venue data when available, with a local fallback list and client-side Haversine filtering to a 700m maximum radius.
- Production-grade implementation should support restroom data loaded from OpenStreetMap or Supabase.
- Display route ETA, distance, and confidence of restroom availability.
- Show an inline route calculation state.
- Show recoverable errors for missing permissions, missing API keys, unavailable routes, and no safe zones.

Acceptance criteria:

- No blocking blank map state during route calculation.
- Route failure includes an immediate next action.
- The map maintains 60 FPS target during navigation mode.

#### 6.1.3 Critical Mass Countdown

The emergency route UI displays a countdown labeled as the remaining safe operational window.

Requirements:

- Countdown should be clearly fictional/assistive and not a medical claim.
- User can adjust or cancel the timer.
- The countdown must not obscure navigation instructions.
- Danger state appears only near expiration.

Acceptance criteria:

- Countdown and ETA are visually distinct.
- Timer state is obvious at a glance.
- UI remains usable under motion and stress.

### 6.2 Clinical-Grade Biometric Logging

Relevant files:

- `frontend/app/(tabs)/log.tsx`
- `frontend/components/SessionTimer.tsx`
- `frontend/components/BristolScale.tsx`
- `frontend/components/VolumeSelector.tsx`
- `frontend/components/ColorPicker.tsx`
- `frontend/components/PhotoCapture.tsx`
- `frontend/lib/storage.ts`
- `frontend/lib/supabase.ts`

#### 6.2.1 Guided Session Flow

The log screen becomes a clinical intake flow.

Requirements:

- Active timer sits at the top as the main biometric module.
- Required fields are Bristol type, volume, and color.
- Notes, photos, location, and social sharing are secondary.
- Submit CTA is "Record Session" or "Archive Log".
- Submit shows disabled, saving, success, error, and offline queued states.
- Duplicate submission is impossible while saving.

Acceptance criteria:

- Success haptic fires only after persistence succeeds.
- Failed photo upload is visible and recoverable.
- Required missing fields are explained before submission.

#### 6.2.2 Frictionless Telemetry Input

Bristol, color, and volume inputs must be optimized for low dexterity.

Requirements:

- Use large touch targets.
- Use accessible labels and selected states.
- Support progressive disclosure if the full set of options is too dense.
- Use color swatches only inside stool-color selection.
- Warn on black, red, or white selections with serious copy and user confirmation.

Acceptance criteria:

- User can complete required inputs one-handed.
- Selected values are visible and announced to assistive tech.
- Health warnings are cautionary, not diagnostic.

#### 6.2.3 Biometric Haptics

Haptics should confirm important state changes without becoming noisy.

Requirements:

- Use haptics for session start, session stop, successful save, and serious warning confirmation.
- Do not trigger heavy haptics for every minor field change.
- Avoid haptic overload during swipe/scroll interactions.

Acceptance criteria:

- Haptics communicate meaningful state change.
- Haptics do not imply success before persistence succeeds.

#### 6.2.4 Privacy-First Photo Capture

The photo capture flow must treat imagery as sensitive.

Requirements:

- Label photo capture as a private vault or private evidence capture.
- Sensitive thumbnails are not exposed in social contexts by default.
- Apply blur in previews where needed.
- If computer vision auto-classification is implemented, the result must be presented as suggested and user-confirmed.
- Any confidence score must be labeled as experimental unless backed by a real model.

Acceptance criteria:

- User can discard or retake photos.
- Upload state is visible.
- Upload failure does not silently save incomplete data.

### 6.3 Statistically Significant Dashboard

Relevant files:

- `frontend/app/(tabs)/stats.tsx`
- `frontend/app/monthly-report.tsx`
- `frontend/lib/achievements.ts`

#### 6.3.1 Frequentist Inference Modeling

The analytics dashboard should evolve from historical display into predictive telemetry.

Requirements:

- Model session timing from historical logs.
- Estimate likely future session windows.
- Show the model type and sample-size caveat.
- If fewer than 30 sessions exist, label the analysis as low-confidence and use a Student's t-distribution framing.
- If 30 or more sessions exist, normal distribution and confidence interval framing may be used.

Acceptance criteria:

- The UI never claims certainty.
- Users can tell whether predictions are high-confidence or low-confidence.
- Empty and low-sample states are useful, not blank.

#### 6.3.2 Confidence Interval Visualization

Stats and monthly reports should include an intentionally over-serious forecast visualization.

Requirements:

- Render a bell curve or circular probability window.
- Shade the 95% confidence interval as the Optimal Safe Zone.
- Label tails as High-Risk Temporal Anomalies.
- Include numeric labels and legends.
- Do not rely on color alone.

Acceptance criteria:

- Visualization is readable on mobile.
- Labels remain clear under system text scaling.
- The chart is framed as pattern analysis, not diagnosis.

#### 6.3.3 Monthly Digest

Monthly report becomes a premium biometric digest.

Requirements:

- Hero metric: health or regularity score.
- Supporting metrics: total logs, total duration, average session, average Bristol, most common time, achievements.
- Include plain-language health insights.
- Share output may include playful brand flavor, but the in-app report remains serious.

Acceptance criteria:

- Monthly report looks like a premium health report.
- Warnings are medically cautious and non-diagnostic.
- Sharing is explicit.

### 6.4 Competitive Gastro-Gamification

Relevant files:

- `frontend/app/(tabs)/social.tsx`
- `frontend/app/achievements.tsx`
- `backend/database/schema.sql`

#### 6.4.1 Private Social Telemetry

The social feed must support community benchmarking without violating privacy expectations.

Requirements:

- Privacy mode defaults on.
- Feed content is blurred or anonymized until revealed.
- Per-card reveal behavior must be implemented if the UI says "Tap to reveal".
- Loading, empty, and error states are required for feed, friends, and benchmark sections.
- Replace unstable random online state with deterministic demo data, real presence, or no online state.

Acceptance criteria:

- No sensitive content appears by default.
- Users understand what is public, private, or temporarily revealed.
- Social content does not flicker or change randomly between renders.

#### 6.4.2 Binary Validation Metrics

Users may respond to shared events using intentionally serious binary feedback.

Requirements:

- Replace casual reaction copy with restrained validation actions.
- Suggested actions:
  - Plunger: positive reinforcement.
  - Flush: acknowledgment.
- Each reaction must have accessible labels.
- Reactions must not expose private content.

Acceptance criteria:

- Reaction actions are obvious but visually secondary.
- Feedback state is visible after tap.

#### 6.4.3 Benchmarking And Heatmap

The social benchmark area may include anonymized global activity telemetry.

Requirements:

- Render global or local activity as anonymized aggregate data.
- Do not show exact user locations.
- Use pulsing radar indicators sparingly and respect reduced-motion settings.
- Label the view as aggregate or simulated if data is not real.

Acceptance criteria:

- Users cannot infer a specific person's private activity.
- Motion does not interfere with readability.

#### 6.4.4 Achievement Matrix

Achievements should feel like clinical milestones with absurdly formal names.

Required examples:

- The Outlier: awarded when a logged session duration falls strictly outside the user's established 95% confidence interval.
- Null Hypothesis: awarded when the user initiates Emergency Override, then cancels before arriving at the safe zone.
- The Metronome: awarded for logging a session at the exact same time three days in a row.
- Ghost Protocol: awarded for a session under 60 seconds.
- The Traveler: awarded for logging sessions in three different regions.

Requirements:

- Locked achievements are subdued.
- Unlocked achievements use premium accent treatment.
- Achievement progress is visible.
- Share action is explicit and secondary.

Acceptance criteria:

- Achievement grid feels premium, not cartoonish.
- Progress state is clear without relying on color alone.

## 7. Backend And Data Requirements

### 7.1 Supabase Data Model

The app will continue to use Supabase/Postgres as the backend boundary.

Current schema source:

- `backend/database/schema.sql`

Required data areas:

- Profiles
- Poop logs
- Venues
- Venue reviews
- Friendships
- User achievements
- Streaks
- Future: safe zones/restroom coordinates
- Future: offline sync queue metadata

### 7.2 Offline Resilience

All session entries must survive degraded network conditions.

Requirements:

- Add local queue support for unsynced session logs.
- Do not overload `frontend/lib/storage.ts` if it remains photo-specific; introduce `frontend/lib/offlineQueue.ts` or equivalent if clearer.
- Queue log payloads immediately before attempting network persistence.
- Sync queued logs when the connection returns.
- Show queued/synced status in the UI.

Acceptance criteria:

- A completed log is not lost when Supabase is unavailable.
- User can see whether an entry is local-only or synced.
- Duplicate sync is prevented.

### 7.3 Storage Privacy

Photo storage must match the product promise.

Requirements:

- Prefer private Supabase storage buckets with signed URLs for sensitive log photos.
- Public URLs are acceptable only for prototype use and must be documented as a risk.
- Venue/toilet photos and sensitive log photos should use separate prefixes or buckets.
- Upload failure must be visible to the user.

### 7.4 Routing Data

Tactical Evacuation Mode requires reliable safe zone data.

Requirements:

- Initial release may use preloaded coordinates for a test area.
- Hackathon release should seed SMU-area restroom venues in Supabase and calculate nearest safe zones in the Expo client using Haversine distance.
- Keep local frontend fallback safe-zone data so Emergency Route works if Supabase or network access fails during judging.
- Next release should support OpenStreetMap toilet data or curated Supabase venue records.
- If using Supabase spatial queries in a later release, evaluate PostGIS for nearest-safe-zone lookup.
- User location must be handled with clear permission states.

## 8. Non-Functional Requirements

### 8.1 Performance

- Maintain a 60 FPS target during Tactical Evacuation Mode.
- Avoid heavy layout animation.
- Animate transform and opacity only.
- Keep map overlays lightweight.
- Use loading skeletons instead of blank states.

### 8.2 Accessibility

- Meet WCAG AA contrast where applicable.
- Support screen readers.
- Label all primary controls.
- Avoid color-only status communication.
- Support system text scaling.

### 8.3 Privacy And Safety

- Logs are private by default.
- Sharing is opt-in.
- Photos are treated as sensitive.
- Health insights use non-diagnostic language.
- Predictions are framed as probabilistic pattern analysis.

## 9. Implementation Phases

### Phase 1: UX Remediation Baseline

Mandatory scope:

- Implement loading, empty, success, and error states.
- Add `isSubmitting` to log submission.
- Delay success haptics until persistence succeeds.
- Make Home Tier 1 action unmistakable.
- Fix Social reveal behavior.
- Add accessibility roles, labels, hints, and selected states.
- Remove random social online status or make it deterministic.
- Clean import ordering.

### Phase 2: Serious Medical Startup Redesign

Mandatory scope:

- Centralize color tokens.
- Convert app surfaces to dark clinical theme.
- Replace emoji-led UI chrome with vector icons.
- Normalize clinical/deadpan copy.
- Improve spacing around primary interactive clusters.
- Preserve high-density, repeat-use ergonomics.

### Phase 3: Tactical Evacuation Protocol

Mandatory scope:

- Redesign PanicButton as Emergency Override Control.
- Add map routing mode.
- Add route loading, failure, and cancel states.
- Add safe zone data source.
- Add Critical Mass Countdown.

### Phase 4: Predictive Analytics

Mandatory scope:

- Implement session timing model.
- Add low-sample messaging.
- Render confidence interval visualization.
- Update monthly report into premium digest.
- Add optional predictive notification copy.

### Phase 5: Competitive Telemetry

Mandatory scope:

- Privacy-first social feed.
- Binary validation reactions.
- Aggregate or simulated heatmap.
- Achievement Matrix expansion.

## 10. Acceptance Checklist

Project PooPals is ready when:

- The first impression reads as premium health app, not novelty app.
- The Tier 1 action on every screen is identifiable within 5 seconds.
- Every async path has visible loading, success, empty, and error handling.
- Log submission cannot duplicate or imply success before persistence.
- Sensitive content defaults private.
- Social reveal behavior matches its labels.
- Navigation and controls are accessible.
- Dark mode feels intentional and complete.
- Analytics distinguish data, forecast, low confidence, and empty states.
- Emergency routing is clear, cancelable, and recoverable.
- Health language never implies diagnosis.
- The product remains absurdly serious without becoming visually silly.
