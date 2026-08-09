# LifeOps / Atlas Mission MVP backup

This archive contains the complete source for the verified LifeOps / Atlas web app as of August 9, 2026.

## What is included

- The cinematic Atlas landing experience and blended background artwork
- Atlas Mission Control
- Life Scan, mission generation, active mission timer, Rescue Mode, evening review, and local pattern memory
- A safe local mission planner that works without an API key
- Optional OpenAI Responses API support for deeper mission personalization
- Automated tests

Generated folders such as `node_modules` and `.next` are intentionally excluded. They can be recreated and should not be copied between computers.

## Safest way to restore

1. Copy this entire extracted folder from the SD card to a new folder on the computer. Do not extract it over an existing LifeOps folder.
2. In Codex, choose **Open folder** and select the extracted folder containing `package.json`.
3. Open the Codex terminal in that folder.
4. Run `pnpm install`.
5. Run `pnpm dev`.
6. Open `http://127.0.0.1:4300/`.

If `pnpm` is unavailable, install Node.js and enable Corepack, then run `corepack enable` before the commands above.

## Optional live AI

The Mission Control experience works locally without credentials. For OpenAI-powered personalization, copy `.env.example` to `.env.local`, add your own `OPENAI_API_KEY`, and restart the development server. Never place `.env.local` or an API key on a shared SD card or in GitHub.

## Verification completed before backup

- TypeScript type check passed
- All 19 automated tests passed
- The complete browser journey passed: Life Scan, mission creation, active mission, Rescue Mode, completion review, and saved history

