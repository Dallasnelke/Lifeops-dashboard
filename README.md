# Atlas MVP

Atlas is a production-quality black-and-gold AI companion MVP. It is built as a separate Next.js application so the existing LifeOps dashboard can stay intact while Atlas evolves into the companion layer.

## What It Does

- Presents a premium landing page with an animated Atlas orb.
- Opens a conversational Atlas panel with streamed AI responses.
- Keeps the OpenAI API key server-side only.
- Supports browser speech recognition where available.
- Supports browser text-to-speech where available.
- Saves optional local conversation memory in the browser.
- Lets users customize Atlas name, form, accent color, personality, and coaching style.
- Includes transparent privacy messaging and controls to clear local data.

## Tech Stack

- Next.js App Router
- TypeScript strict mode
- React
- OpenAI Responses API
- Zod validation
- Browser SpeechRecognition and SpeechSynthesis APIs
- Local browser storage for optional session memory
- Node test runner

## Local Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

If you are using the Codex bundled runtime in this workspace instead of a normal Node installation, use the bundled package manager path already available in the workspace.

## Environment Variables

Create `.env.local`:

```bash
OPENAI_API_KEY=your_server_side_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Never put a real API key in client code, GitHub, screenshots, or shared zip files.

## API Route

`POST /api/atlas` validates every request before contacting OpenAI.

Protections included:

- Empty message rejection
- 4000-character message limit
- History item validation
- Recent-history truncation
- Server-side controlled Atlas instructions
- In-memory request rate limit
- 30-second timeout
- Abort handling when the client disconnects
- Safe user-facing errors
- Streaming response output when supported

## Local Memory

Atlas stores optional session memory in browser `localStorage` under `atlas-mvp-session-v1`.

Stored locally:

- Conversation id
- Visible message history
- Atlas display preferences
- Voice preference
- Local-memory preference

Not stored locally by Atlas:

- OpenAI API key
- Server system instructions
- Bank credentials
- Passwords
- Social Security numbers
- Authentication tokens

Users can turn local memory off, clear the conversation, or delete all local Atlas data from the Character settings panel.

## Privacy Notes

Atlas is privacy-conscious, not magic. Messages sent to Atlas are sent to the server route so the server can call the configured OpenAI model. The UI does not claim end-to-end encryption, zero retention, or complete privacy. A production version should add accounts, database policy, audit logging, encryption planning, and clear provider retention disclosures.

## Character Studio

Current working forms:

- Orb
- Emblem

Planned forms shown honestly as coming later:

- Humanoid
- Pet
- Spirit
- Robot

## Accessibility

- Dialog uses `role="dialog"` and `aria-modal`.
- Escape closes the Atlas dialog.
- Focus is trapped while the dialog is open and returned on close.
- Controls have visible labels or aria labels.
- Touch targets are at least 44px.
- Reduced motion is respected through CSS.
- Voice features are optional and browser-dependent.

## Testing

Run direct commands if normal `npm` is not on PATH:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

The included tests cover:

- Zod request validation
- Message length limits
- History truncation
- Preference validation
- Local storage save/load/clear
- Rate limiting
- Chat streaming state transitions
- Failed response state handling
- Stop-generation state handling

## Current Limitations

- No authenticated accounts yet.
- No database memory yet.
- No real 3D character yet.
- No server-side voice provider yet.
- Browser speech recognition support varies by browser.
- The rate limiter is in-memory and resets when the server restarts.
- This MVP is separate from the existing LifeOps single-file app.

## Recommended Next Steps

1. Connect Atlas to selected LifeOps data through a safe server-side context layer.
2. Add authenticated accounts and database-backed memory.
3. Prototype the full 3D Atlas character as a separate, performance-tested layer.
