# LifeOps Atlas Foundation

LifeOps Atlas Foundation is the reset MVP for Atlas: a premium black-and-gold AI companion interface focused on the Atlas character, chat, customization, privacy, and a server-side AI route.

The old LifeOps dashboard modules are intentionally paused. This project is now the foundation for building Atlas first, then reconnecting LifeOps features later.

## Current Experience

The app opens to a full-screen Atlas visual scene. The main character is now rendered with a local WebGL layer instead of only a flat image or SVG. The SVG character remains as a graceful fallback if WebGL is unavailable.

Current first screen:

- Full-screen black-and-gold Atlas stage
- Native WebGL 3D character placeholder
- Metallic black body material
- Config-driven black/graphite humanoid body
- Gold chest core with dark outer housing
- Minimal abstract face with controlled eye/sensor styles
- Soft lighting and idle breathing motion
- State-driven visual behavior
- Click Atlas to open the assistant

## Renderer Architecture

The rest of the app renders Atlas through:

```tsx
<AtlasStage />
```

`components/atlas/AtlasStage.tsx` is the stable boundary. It currently delegates to `AtlasWebGLStage`, a native WebGL renderer that builds Atlas from procedural ellipsoid body parts. This keeps the prototype local, fast, and dependency-light while leaving room to replace the internals with a real GLB/VRM model later.

The reusable avatar configuration lives in:

```text
lib/atlas/avatar-config.ts
```

The config includes proportions, materials, face style, core intensity, glow, orbit intensity, particles, environment preset, and a `futureMapping` block that documents how each concept can later map to morph targets, materials, mesh swaps, bone scaling, attachments, and animation states.

## Atlas Character States

Atlas supports these visual states:

- Idle
- Listening
- Thinking
- Speaking
- Success
- Attention
- Error

These states are connected to the assistant flow so Atlas can visually react while the user speaks, sends a message, receives a response, or stops generation.

## Character Customization

The Character Studio currently supports:

- Atlas name
- Voice style
- Appearance preset
- Accent/glow color
- Motion level
- Visual intensity
- Character form preference
- Personality
- Coaching style

Preferences are stored locally in the browser when local memory is enabled.

Current appearance presets:

- Minimal: quiet silhouette, low particles, subtle orbit system
- Sentinel: balanced flagship form with stronger shoulders, core, and cinematic depth
- Ethereal: slimmer, longer, more energetic orbit and seam behavior

## AI Architecture

The app includes a server-side OpenAI route at:

```text
app/api/atlas/route.ts
```

The route streams Atlas responses and is designed to produce practical command-style guidance. Atlas should answer with:

- Priority
- Recommended action
- Reason
- Evidence
- Estimated time
- Risk if ignored

The route requires local environment variables:

```text
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=your_model_here
```

Use .env.local for real keys. Do not upload .env.local to GitHub.

## Local-First Storage

Atlas stores local session data under this browser storage key:

```text
atlas-mvp-session-v1
```

Stored data includes:

- Conversation ID
- Chat messages
- Atlas preferences

The current MVP does not use a cloud database, accounts, or sync.

## Privacy Notes

- Data is local by default in this MVP.
- Do not store passwords, banking credentials, health credentials, or private account tokens in localStorage.
- AI calls only happen through the server route when configured with an API key.
- The app should not claim that external integrations are connected until real OAuth and security architecture exist.

## Project Structure

```text
app/
  page.tsx                 Main Atlas visual shell
  globals.css              Global visual system and layout
  api/atlas/route.ts       Server-side Atlas AI route
components/atlas/
  AtlasWebGLStage.tsx      Native WebGL 3D Atlas renderer
  AtlasChat.tsx            Assistant modal shell
  AtlasCharacterStudio.tsx Customization controls
  AtlasComposer.tsx        Chat input
  AtlasMessage.tsx         Message rendering
  AtlasOrb.tsx             Compact Atlas orb
  AtlasPrivacy.tsx         Privacy information
  AtlasSettings.tsx        Local settings
  AtlasStateIndicator.tsx  State label
hooks/
  useAtlasChat.ts
  useAtlasSpeechRecognition.ts
  useAtlasSpeechSynthesis.ts
lib/atlas/
  schemas.ts
  storage.ts
  types.ts
  instructions.ts
  lifeops-context.ts
  history.ts
  rate-limit.ts
tests/
  *.test.ts
public/
  Local visual assets
```

## Current Avatar Limitations

Atlas is still a procedural prototype, not a final production 3D character. The current WebGL renderer uses generated sphere geometry scaled into a humanoid silhouette. Final realism will require:

- An optimized GLB/VRM humanoid model
- Custom PBR materials
- Rigged idle/listening/thinking/speaking animations
- Facial morph targets or shader-driven sensor expressions
- Real attachment points for core, seams, orbit effects, and accessories
- Texture maps for roughness, metalness, emission, and normal detail

## Run Locally

Install dependencies if needed:

```bash
pnpm install
```

Start development mode:

```bash
pnpm dev
```

Run production build locally:

```bash
pnpm build
pnpm start
```

Current local preview used during development:

```text
http://127.0.0.1:4300/
```

## Verification Checklist

Before uploading or sharing:

- TypeScript passes
- ESLint passes on source folders
- Tests pass
- Production build passes
- App loads at local URL
- WebGL canvas initializes
- No browser console errors
- Atlas opens assistant on click
- Assistant closes cleanly
- Character Studio shows voice, color, motion, personality, and coaching controls
- No .env.local, .next, node_modules, or private data is uploaded

## Latest Verified Changes

- Added native WebGL Atlas render layer.
- Preserved SVG fallback.
- Added state-aware breathing and glow behavior.
- Added voice style preference.
- Wired voice style into browser speech synthesis.
- Preserved chat, privacy, local storage, tests, and AI route.

## Next Development Steps

1. Replace the procedural WebGL placeholder with a real optimized GLB character model.
2. Build an Atlas Command UI that displays priority, reason, evidence, estimated time, and risk.
3. Add a safe read-only bridge from LifeOps data back into Atlas.
