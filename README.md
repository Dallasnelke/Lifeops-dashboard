# LifeOps Atlas Foundation

LifeOps Atlas Foundation is the current focused MVP for LifeOps. It combines a minimal first-launch setup, a single command-focused dashboard, and the Atlas AI companion.

The product is intentionally narrowed to the foundation:

- Dashboard
- Atlas
- Local profile setup
- Privacy controls
- Server-side AI route

Older LifeOps modules are preserved in the main repository for later reuse, but they are not the visible focus of this MVP.

## Current Experience

The app starts with a modular Atlas setup flow:

1. Name
2. Atlas personality
3. Character prototype customization
4. Voice direction
5. Focus areas
6. Challenges
7. Daily rhythm
8. Memory permissions
9. Review
10. Completion scene

After setup, the dashboard shows:

- Greeting
- One Atlas Command
- Priority
- Estimated time
- Guidance style
- Reason
- Risk if ignored
- Evidence
- Atlas companion launcher

## Onboarding Architecture

The onboarding system is now separated from `app/page.tsx`.

Core files:

```text
lib/onboarding/types.ts
lib/onboarding/options.ts
lib/onboarding/content.ts
lib/onboarding/profile.ts
lib/onboarding/repository.ts
lib/onboarding/analytics.ts
components/onboarding/FoundationOnboarding.tsx
components/onboarding/OnboardingProgress.tsx
components/onboarding/OnboardingNavigation.tsx
components/onboarding/OnboardingStepLayout.tsx
components/atlas-character/CharacterRenderer.tsx
```

The current `CharacterRenderer` is a CSS/React prototype model. It is intentionally labeled as a prototype and is built behind a component boundary so a future Three.js, glTF, or VRM renderer can replace it without rebuilding the onboarding flow.

## Onboarding Persistence

Onboarding profile data is stored locally under:

```text
lifeops-onboarding-profile-v1
```

The profile is versioned and sanitized on load. Missing fields receive safe defaults so future migrations can be added without breaking old profiles.

## Atlas AI

Atlas uses a server-side Next.js API route at:

```text
POST /api/atlas
```

The OpenAI API key stays server-side and must be stored in `.env.local`.

Required:

```bash
OPENAI_API_KEY=your_server_side_key_here
```

Optional:

```bash
OPENAI_MODEL=gpt-4.1-mini
```

Never commit `.env.local`, real API keys, personal backups, bank credentials, health credentials, passwords, or authentication tokens.

## LifeOps Bridge

The existing LifeOps dashboard can still open Atlas through the local bridge:

```text
js/atlas/atlas-mvp-bridge.js
```

That bridge sends a summarized read-only LifeOps context snapshot by browser `postMessage`.

Atlas does not receive broad direct access to LifeOps `localStorage`.

## Local Storage

Atlas stores optional local data in the browser:

- Atlas conversation and preferences: `atlas-mvp-session-v1`
- LifeOps onboarding profile: `lifeops-onboarding-profile-v1`

Stored locally:

- Display name
- Focus areas
- Atlas guidance style
- Today's concern
- Conversation history if local memory is enabled
- Atlas character preferences

Not stored by Atlas:

- OpenAI API key
- Passwords
- Bank credentials
- Social Security numbers
- Authentication tokens

## Local Setup

Install dependencies:

```bash
npm install
```

Start locally:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:4300/
```

To test from another device on the same Wi-Fi, run Next with a network host:

```bash
npx next dev -H 0.0.0.0 -p 4300
```

Then open the computer's local network IP from the other device.

## Testing

Run:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Current automated coverage includes:

- Request validation
- Message length limits
- History truncation
- Preference validation
- Local storage save/load/clear
- Rate limiting
- Chat streaming state transitions
- Stop-generation handling
- Read-only LifeOps context validation

## Current Limitations

- No authenticated accounts yet.
- No database memory yet.
- No real cloud sync yet.
- No mobile app shell yet.
- No full 3D Atlas character yet.
- The original LifeOps modules are preserved separately and should be reintroduced one by one only after the foundation is strong.
- Browser speech recognition support varies by browser.
- The rate limiter is in-memory and resets when the server restarts.

## Recommended Build Order

1. Stabilize the foundation dashboard and onboarding.
2. Improve Atlas Command quality and explanation.
3. Add persistent database-backed memory.
4. Add accounts and cloud backup.
5. Reintroduce LifeOps modules one at a time.
6. Build the 3D Atlas character after the intelligence layer is useful.
