# LifeOps Atlas Foundation

LifeOps Atlas Foundation is currently reset to a wordless Atlas visual prototype. The active product surface is the Atlas AI presence, with the rest of LifeOps intentionally paused until the visual and intelligence foundation is strong.

The product is intentionally narrowed to:

- Atlas visual presence
- Local cinematic reference asset
- Hidden/paused chat foundation
- Hidden/paused character settings
- Server-side AI route preserved for later

Older LifeOps modules are preserved in the main repository for later reuse, but they are not the visible focus of this MVP.

## Current Experience

The app opens directly to a full-screen Atlas visual scene. There are no visible words, onboarding gates, dashboard cards, or chat panels in the active first screen.

Preserved for later development:

- Chat
- Server-side OpenAI route
- Streaming responses
- Optional local conversation memory
- Character customization
- Voice controls when the browser supports them
- Privacy information

Atlas is an AI companion. It can help organize thoughts and suggest next actions, but it should not replace qualified professional advice.

## Visual Asset

The current active scene uses this local asset:

```text
public/atlas-visual-reference.png
```

This is a prototype visual direction. A production 3D character should eventually replace it with a proper model/rendering pipeline.

## Paused Onboarding Architecture

The previous onboarding system remains in the codebase for reference, but it is not mounted by `app/page.tsx` in the current Atlas-only reset.

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

## Paused Onboarding Persistence

Onboarding profile data is stored locally under:

```text
lifeops-onboarding-profile-v1
```

The profile is versioned and sanitized on load, but the active Atlas-only route does not require onboarding completion.

Current profile version:

```text
2
```

Version 2 adds nutrition-specific fields for goal, optional body baseline, eating style, food preferences, daily rhythm, common challenges, tracking preference, privacy permissions, and the generated first plan. Old version 1 profiles are migrated safely. Legacy general focus areas are preserved as legacy context and are not treated as confirmed nutrition data.

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

Stored locally by the active Atlas system:

- Conversation history if local memory is enabled
- Atlas character preferences
- Atlas guidance style

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
- Atlas nutrition guidance is general wellness support only, not medical advice.

## Recommended Build Order

1. Make Atlas useful without any LifeOps modules.
2. Improve prompt quality, safety boundaries, and response structure.
3. Add persistent database-backed memory.
4. Add accounts and cloud backup.
5. Add onboarding back only after Atlas has a strong core experience.
6. Build the 3D Atlas character after the intelligence layer is useful.
