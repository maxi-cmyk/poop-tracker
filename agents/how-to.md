# How To Use Agents

Use `AGENTS.md` as the short global rulebook and `agents/` as the role library.

## 1. Start Every Agent With The Global Rules

Tell the agent:

```text
Read AGENTS.md first and follow it.
```

This gives the agent the project scope, source-of-truth docs, verification rules, and handoff format.

## 2. Pick One Role Brief

Choose the brief that matches the work:

- `backend-seed-agent.md`: Supabase seed data and backend demo setup.
- `theme-foundation-agent.md`: dark clinical theme, shared tokens, navigation chrome.
- `emergency-route-agent.md`: SMU 700m Tactical Evacuation map flow.
- `logging-reliability-agent.md`: safe log submission, upload errors, haptics.
- `stats-social-agent.md`: stats states, forecast copy, social privacy.
- `qa-demo-agent.md`: read-only final demo verification.

Then tell the agent:

```text
Use agents/<brief-name>.md as your role brief.
Stay within its File Ownership section.
Do not revert edits made by other agents.
```

## 3. Recommended Order

Run these first:

```text
backend-seed-agent.md
theme-foundation-agent.md
```

Then run these in parallel:

```text
emergency-route-agent.md
logging-reliability-agent.md
stats-social-agent.md
```

Run this last:

```text
qa-demo-agent.md
```

## 4. Agent HQ Role Mapping

Suggested Agent HQ setup:

- Project Manager: `AGENTS.md` + `agents/README.md`
- Backend/Supabase Engineer: `backend-seed-agent.md`
- Frontend UI Engineer: `theme-foundation-agent.md`
- Maps/Feature Engineer: `emergency-route-agent.md`
- Reliability Engineer: `logging-reliability-agent.md`
- Product UI Engineer: `stats-social-agent.md`
- QA Engineer: `qa-demo-agent.md`

## 5. Handoff Format

Each agent should end with:

```text
Changed files:
- ...

What changed:
- ...

Validation:
- Command: ...
- Result: ...

Known risks / follow-ups:
- ...
```

## 6. Integration Loop

After each agent returns:

1. Review changed files.
2. Check whether it stayed inside file ownership.
3. Run or read the reported validation.
4. Resolve conflicts before starting dependent work.
5. Update `docs/nextsteps.md` checkboxes when work is actually verified.

## 7. Verification Rules

For coding agents, prefer:

```bash
npm --prefix frontend exec tsc --noEmit
```

For UI/demo agents, also run when practical:

```bash
npm run web
```

For final UI polish:

```bash
rg 'Math\.random|PANIC BUTTON|FLUSH IT|#8B5A2B|#FFFAF5|#FFF8F0' frontend/app frontend/components frontend/constants
```

For docs-only agents, read back the changed sections and inspect:

```bash
git diff -- <files>
```
