# LifeOps Dashboard

## Product Summary

LifeOps is a personal life operating dashboard for managing money, health, habits, goals, tasks, wellness signals, and long-term planning from one local-first interface. The current project is a polished Version 1 static web app built as a single HTML file.

## Mission And User Problem

LifeOps is designed to help users see the connections between daily choices and longer-term stability. Many people track budgeting, fitness, food, tasks, and goals in separate places. LifeOps brings the most important daily signals into one clean dashboard so users can decide what to focus on today.

The app does not provide financial, tax, legal, medical, investing, or nutrition advice. Current recommendations are simple rule-based prompts based on the user's own logged data.

## Current Features

- Home-style dashboard overview with LifeOps score, Atlas Local Intelligence, daily missions, reward momentum, and category score cards
- Atlas Local Intelligence layer: structured local context, top priorities, recommended action, urgency, impact areas, evidence, confidence, and transparent "why" explanation
- Page-level Atlas insight strip that explains what matters inside each major section without claiming real AI or remote connectivity
- Faster Atlas first-launch interview with 12 essential setup questions, optional skip/ask-later/finish controls, section-based progress, and an Operating System Blueprint
- Optional Complete My Blueprint path with the remaining deep personalization questions from the original interview
- Smart Follow Up cards in Finance, Health, Education, and Career so detailed setup happens contextually instead of blocking first launch
- Checkpoint 1 Home hierarchy with greeting, today's focus, next best action, Life Score, category cards, missions, upcoming items, quick actions, recent win, and timeline preview
- Built-in theme system with LifeOps Green, Midnight, Sunrise, Focus, and Ocean themes
- Appearance settings for theme, light/dark/system mode, compact/comfortable density, and reduced visual effects
- Optional profile card with display name, initials, pronouns, avatar color, avatar icon, personal title, and current focus
- Optional rewards toggle for XP, levels, streaks, and achievements
- Full local Life Timeline section with manual milestones, categories, related goals, notes, and privacy metadata
- Local Connections prototype with profiles, groups, shared lists, shared goals, challenges, shared calendar previews, and permission previews
- Privacy Center explaining local storage, backup controls, data classifications, sharing defaults, and sensitive-data safeguards
- Integrations Center showing planned/disconnected app connections with honest statuses and privacy notes
- Focused visual polish pass with larger readable text, stronger subtabs, clearer section summaries, modal-based add flows, and more distinct theme palettes
- Premium Personal Operating System visual refinement with dynamic page headers, category accents, stronger card contrast, improved progress bars, polished buttons, richer empty states, and upgraded sidebar/mobile navigation styling
- Ten-item desktop navigation with Dashboard, Finance, Health, Education, Career, Goals, Calendar, Documents, Settings, and Modules
- Collapsible desktop sidebar with local preference storage
- Five-item mobile bottom navigation with additional sections accessible through More
- Real local data models and modal forms for Education courses, assignments, exams, learning goals, and education costs
- Real local data models and modal forms for Career applications, interviews, contacts, career goals, skills, and achievements
- Unified local Calendar section that combines LifeOps dates with manual calendar events
- Documents Center for local document references, privacy metadata, sensitivity labels, and related notes
- Modules screen with enable/disable controls for optional areas and dashboard customization toggles
- Settings hub with focused panels for profile, appearance, dashboard targets, accessibility, gamification, and developer details
- Daily summary: current priority, emergency fund progress, savings, income, expenses, cash flow, tasks, habits, workouts, steps, and recommended focus
- Daily mission system with three focused actions, mission XP, and progress status
- Visual rewards with XP, level progress, streak status, badges, and next unlock
- Profile setup for food budget, macro targets, savings goal, workout goal, and sleep goal
- Monthly income, current savings, savings goal, and emergency fund target
- Expense, bill, and debt payment tracking
- Due dates for bills and debt payments
- Upcoming payment warning in the daily dashboard summary
- Daily tasks organized by life area
- Daily habit checks
- Workout tracking and step goal tracking
- Food and macro logging with food cost tracking
- Goal tracking and weekly action planning
- Wellness tracking for sleep, water, mood, stress, and energy
- Daily history snapshots and trend summaries
- Weekly review and report preview/export
- Atlas Local detail drawer with message bubbles, quick replies, typing animation, session history, action buttons, supported local questions, and unsupported-question fallback
- Always-available Atlas Local drawer for grounded local questions from any screen as a secondary detail view
- Companion customization for name, initials, avatar color, tone, coaching style, and preferred focus
- Premium startup overlay with skip control, reduced-motion support, and dashboard entrance animation
- Optional built-in browser voice guidance using SpeechSynthesis, clearly separate from real AI
- Optional locally generated LifeOps Pulse startup sound using the Web Audio API
- Morning briefing button with visible briefing text, voice status, pause/resume/stop, voice selection, and speaking rate controls
- Five-destination app navigation with Home as the default screen
- Secondary tabs that keep detailed sections accessible without crowding the primary navigation
- Mobile bottom navigation for Home, Money, Health, Growth, and More
- More screen for data backup, reports, companion tools, settings, about, and developer details
- Portfolio/About and Case Study sections
- JSON backup export and validated restore
- Reset with confirmation
- Empty-data test mode
- Responsive sidebar/mobile navigation
- Empty states for key lists

## Current Project Structure

```text
.
|-- .gitignore
|-- README.md
|-- outputs/
|   `-- lifeops-dashboard.html
`-- work/
    |-- backups/
    |   `-- lifeops-dashboard-*.html
    `-- lifeops-script-check.js
```

`outputs/lifeops-dashboard.html` is the user-facing application. The `work` folder contains temporary validation files and timestamped backups made during development and should stay out of GitHub.

## Technology Used

- HTML
- CSS
- Vanilla JavaScript
- Browser `localStorage`
- No external runtime dependencies
- No paid services, external APIs, accounts, tracking scripts, or cloud storage

## How To Run Locally

Open the app directly in a browser:

```text
outputs/lifeops-dashboard.html
```

If a local server is already running, use:

```text
http://127.0.0.1:4173/lifeops-dashboard.html
```

Because this is a static app, no build step is required.

## How Data Is Stored

LifeOps Version 1 stores data in the user's browser using:

```text
localStorage key: lifeops-dashboard-v1
```

Data stays on the same browser and device unless the user exports it. Clearing browser storage, using another browser, or opening the file in a different browser profile may show starter data instead of the user's saved data.

## Backup And Restore

### Export

Use the `Export` button to download a JSON backup of the current LifeOps data.

Do not commit exported backup files to GitHub if they contain real personal data. Use safe demo data only for portfolio or public demo versions.

### Restore

Use the `Restore` button to select a LifeOps JSON backup. The app validates that the file is a JSON object and that list fields are arrays before replacing current local data. The restore action asks for confirmation before overwriting existing browser data.

### Reset

Use the `Reset` button to clear local LifeOps data and reload the starter sample. Reset requires confirmation.

## Known Limitations

- Data is stored locally in one browser profile.
- No cloud sync or account login exists yet.
- Import validation checks structure, but it is not a full database migration system.
- Edit actions use a reusable in-app modal, but the modal is still intentionally simple.
- Education, Career, Calendar, and Documents data is local only and does not sync to outside school, employer, calendar, or cloud systems.
- Disabling a module hides navigation and dashboard surfaces but does not delete the saved data.
- Upcoming payment warnings depend on due dates entered on expenses.
- Financial calculations are simple cash-flow and progress calculations only.
- Atlas Local recommendations and drawer answers are deterministic, rule-based, session-only, and not connected to a real AI model.
- Atlas Local can answer supported structured questions from local LifeOps data. Unsupported open-ended chat returns a clear "cannot answer that yet" response.
- Full conversational AI requires a secure backend, authentication, privacy filtering, rate limits, and server-side model API handling. Private model API keys must never be stored in browser code.
- Voice guidance uses the browser's built-in SpeechSynthesis feature and may vary by browser/device.
- Voice is off by default and does not speak unless enabled by the user.
- Startup sound is generated locally with the browser Web Audio API as the LifeOps Pulse.
- Some browsers block automatic startup sound or speech until the user presses a page button such as Start Voice Experience.
- Theme and appearance settings are stored locally and included in future JSON backups.
- Connections, timeline sharing, and integration concepts are local previews only until a secure backend/account system exists.
- No encryption is implemented yet.
- No App Store wrapper exists yet.

## Privacy And Security Considerations

- Version 1 keeps data local and does not transmit personal information externally.
- Users should not store passwords, banking credentials, Social Security numbers, tax IDs, authentication codes, or sensitive medical details in this app.
- Exported JSON files may contain personal financial and health-related information. Store backups carefully.
- Current sharing, timeline, connection, and integration concepts are local previews only.
- The Privacy Center summarizes what is local, what is not connected, and which data types should be treated as sensitive.
- Future social features must default to Only me and avoid exposing sensitive information in voice briefings, social cards, exports, or notifications.
- Future versions should evaluate optional encryption, passcode protection, and secure mobile storage before public release.

## Mobile And App Store Considerations

LifeOps is currently a responsive static web app. To prepare for public mobile distribution, future work should consider:

- Five primary mobile destinations with secondary tabs for deeper sections
- Offline-first storage strategy
- Secure local storage or encrypted storage
- Clear onboarding and privacy disclosures
- App Store review requirements
- Accessibility testing
- Data export and account deletion expectations if accounts are added later

## Development Roadmap

### Version 1: Core Life Dashboard

Focus on a stable local-first dashboard:

- Dashboard overview
- User profile settings
- Monthly income
- Current savings
- Savings goal
- Emergency fund target and progress
- Expense, bill, and debt payment tracking
- Tasks by life area
- Daily habit checks
- Workout and step goal tracking
- Current priority
- JSON backup and restore
- Clear empty states
- Input validation
- Mobile responsive layout
- Accessible labels and controls
- Reliable local persistence

### Version 2: Financial Command Center

Plan only until Version 1 is stable:

- Net worth tracking
- Assets and liabilities
- Debt accounts, interest rates, and minimum payments
- Debt payoff progress
- Savings accounts and goals
- Monthly budget categories
- Recurring bills and subscriptions
- Cash-flow forecasting
- Upcoming payment calendar
- Emergency fund safety warnings
- Purchase affordability check
- Transparent financial charts

### Version 3: Career And Education

Current local modules now include basic data models and add forms for:

- Job application tracker
- Status, salary range, interview dates, prep notes, contacts, and follow-up reminders
- School course tracker
- Credits completed and credits remaining
- Education costs
- Assignment and semester planning

Later versions may add GPA planning, financial aid, refund estimates, stronger reminders, and authenticated calendar/task integrations.

### Version 4: Taxes, Health, And Documents

Planned organization modules only:

- Capital loss carryforward tracking
- Tax document checklist
- W-2, 1099, and 1098-T tracking
- Education credit records
- Medical appointment tracking
- Health expenses
- Medication or treatment notes
- Important document inventory

These modules must not provide tax, legal, or medical conclusions.

### Version 5: Atlas Local And Future Assistant

Current local intelligence layer:

- Builds a structured local context from profile, finance, bills, savings, nutrition, fitness, wellness, education, career, goals, calendar, recent actions, scores, and privacy settings
- Ranks priorities with visible rule-based factors such as urgency, due dates, impact, time needed, overdue status, and current weak areas
- Answers supported local questions with What I found, Why it matters, Recommended action, Evidence, Confidence, and Data freshness
- Refuses unsupported open-ended chat with a clear note that full conversational AI requires a secure backend connection
- Keeps future AI extension points separate from the current browser-only implementation

Example questions:

- Can I afford this purchase?
- How close am I to my emergency fund goal?
- What bills are due soon?
- What should I focus on today?
- How much debt remains?
- What job applications require follow up?
- What documents do I need for taxes?

## Theme System

LifeOps uses CSS custom properties for its main visual tokens: page background, card background, elevated surface, primary colors, navigation background, text, borders, status colors, shadows, focus ring, and progress colors.

Built-in themes are LifeOps Green, Midnight, Sunrise, Focus, and Ocean. Appearance settings are optional fields in local state, so older backups without these fields restore with safe defaults.

## Home Experience

The Home screen is organized around what the user needs quickly: today's focus, next best action, current Life Score, category status, daily missions, upcoming items, quick actions, recent win, and a Life Timeline preview.

The recommendation system remains rule based and transparent. It does not claim to be real AI.

## Gamification Rules

Current rewards are simple progress feedback. XP can come from meaningful logged actions such as meals, workouts, habits, tasks, weekly actions, water, sleep, and emergency fund progress. LifeOps does not use random rewards, paid XP, loot boxes, gambling mechanics, trading mechanics, or missed-day penalties.

Future work should add clearer daily XP limits and a complete gamification disable setting before public release.

## Life Timeline

LifeOps includes a local Life Timeline section for meaningful milestones rather than every data entry. Milestones support title, date, category, optional note, optional related goal, and privacy level.

Timeline sharing states should remain local metadata only until secure accounts, permissions, and synchronization exist.

## Connections And Integrations

Connections are not active yet. The current Connections card is a local preview and does not send invitations, messages, or shared data.

Third-party integrations remain planned only. LifeOps does not currently connect to banks, health apps, calendars, email, music, cloud storage, or social platforms. Future integrations will require a secure account system, OAuth or platform-approved authentication, permission screens, disconnect controls, privacy review, and App Store or platform permissions where required.

Do not store credentials, tokens, bank logins, health credentials, passwords, or sensitive authentication information in localStorage.

## Testing Checklist

Manual Version 1 checks:

- Open the app locally.
- Refresh the page and confirm data persists.
- Edit profile targets in Setup.
- Add, edit, complete, and delete a task.
- Toggle each daily habit checkbox.
- Add, edit, and delete an expense.
- Add a bill due within 7 days and confirm it appears in the dashboard summary.
- Add, edit, and delete a workout.
- Update workout goal and steps.
- Add, edit, and delete a meal.
- Use Quick Add saved meal.
- Copy last meal.
- Add, edit, and delete a goal.
- Add, edit, complete, and delete a weekly action.
- Save today's snapshot.
- Switch between every tab.
- Export JSON backup.
- Restore a valid JSON backup.
- Try restoring corrupted JSON and confirm it is rejected.
- Try restoring JSON with missing fields and confirm defaults fill in.
- Reset app data and confirm the starter sample reloads.
- Use Empty Test mode and confirm blank lists, empty states, and zeroed calculations work.
- Test empty lists after deleting all rows.
- Test invalid, blank, negative, and very large number inputs.
- Test report preview and download for all report types.
- Test the Atlas Local tab quick replies, chat input, mission cards, action buttons, and unsupported-question fallback.
- Test supported Atlas Local questions such as "What should I do next?", "What is due this week?", "How is my money?", and "What should I eat based on my logged data?"
- Confirm Atlas Local answers cite local evidence, confidence, and data freshness instead of generic canned advice.
- Test Dashboard home cards, mission progress, XP cards, streak card, and recent trend.
- Test the five primary navigation destinations: Home, Money, Health, Growth, and More.
- Test secondary tabs inside each primary destination.
- Test More screen backup, restore, reset, report, settings, coach, about, and developer shortcuts.
- Test startup animation, Skip Animation, reduced-motion behavior, and Home entrance animation.
- Test Atlas essential onboarding, including Text Conversation, Skip, Ask me later, Finish setup now, Use what you know, Back, and Blueprint output.
- Test Complete My Blueprint and confirm the optional deep personalization questions remain available.
- Test Smart Follow Up cards in Finance, Health, Education, and Career.
- Test voice Off, startup greeting only, morning briefing only, both voice modes, preview, play, pause, resume, stop, and repeated button presses.
- Test startup sound Off and On, Preview LifeOps Pulse, preview startup experience, and Start Voice Experience.
- Test missing or unavailable browser voice fallback.
- Test all five themes.
- Test light, dark, and system appearance behavior.
- Test compact and comfortable density.
- Test reduced visual effects.
- Test redesigned Home greeting, focus, next action, score, category cards, missions, upcoming items, quick actions, recent win, and timeline preview.
- Test Profile Card settings.
- Test gamification enabled and disabled.
- Test adding and deleting Life Timeline milestones.
- Test old backup compatibility for missing appearance, personalization, and timeline fields.
- Test desktop width.
- Test common mobile widths such as 390px, 430px, and 768px.

## Version History

- `1.23.0` - Refactored Atlas onboarding into a faster 12-question Essential Setup, optional Smart Follow Up cards, and a Complete My Blueprint deep personalization path while preserving the original detailed onboarding fields.
- `1.22.1` - Fixed Atlas onboarding progression after the first question by preserving the active onboarding state object instead of recreating it during each state read. Verified the full 34-question onboarding flow, final summary, and Launch LifeOps exit behavior.
- `1.22.0` - Rebuilt the assistant surface as Atlas Local Intelligence with structured local context, deterministic priority ranking, grounded response sections, evidence, confidence, data freshness, supported local question handling, unsupported-question fallback, Atlas status language, and future secure AI integration placeholders.
- `1.20.0` - Added the first Atlas OS intelligence layer with a permanent Home Atlas card, proactive local priority signals, estimated time, impact labels, transparent recommendation reasoning, page-level Atlas insight strips, and secondary Ask Atlas detail drawer while preserving existing app data and business logic.
- `1.19.0` - Completed a focused premium visual refinement pass with dynamic section headers, category identity accents, stronger card contrast, richer empty states, improved button/progress/sidebar styling, dashboard five-card hierarchy, and responsive polish while preserving existing functionality and data compatibility.
- `1.18.0` - Built Checkpoint 2 real local data models and modal forms for Education, Career, Calendar, and Documents; added Checkpoint 3 module enable/disable behavior, dashboard customization controls, and a visual polish pass for navigation, prototype cards, module cards, and mobile bottom navigation.
- `1.17.0` - Started the navigation redesign with ten desktop primary destinations, a five-item mobile bottom nav, collapsible desktop sidebar, Settings hub panels, local prototype pages for Education, Career, Calendar, Documents, and Modules, and optional sidebar preference storage.
- `1.16.0` - Completed a focused visual polish pass with larger body text, stronger touch targets, section-specific summaries, modal-based add forms, simplified Home hierarchy, dashboard-only global metrics, and distinct dark palettes for each theme.
- `1.15.0` - Added the local Connections prototype, Privacy Center, Integrations Center, theme readability fixes for dark appearances, desktop overflow fixes, and modal focus trapping/Escape-to-close behavior.
- `1.14.0` - Added profile/avatar personalization, optional gamification toggle, clearer achievements, full local Life Timeline, Appearance controls inside Settings, and backup compatibility tests for new optional fields.
- `1.13.0` - Added Checkpoint 1 theme system, Appearance settings, CSS design tokens, redesigned Home hierarchy, category cards, quick actions, recent win, and timeline preview while preserving existing logic.
- `1.12.0` - Set the default voice mode to startup greeting plus morning briefing and refined the LifeOps Pulse with a smoother futuristic two-chime Web Audio design.
- `1.11.2` - Added a timeout around blocked browser audio startup so the app falls back without stalling.
- `1.11.1` - Changed startup audio to attempt the LifeOps Pulse first, then show Start Voice Experience only if the browser blocks playback.
- `1.11.0` - Replaced the generic startup tone with the branded LifeOps Pulse and added best-effort UK English male voice preference for startup speech.
- `1.10.0` - Added optional local Web Audio startup sound, startup volume, preview startup sound, preview startup experience, and Start Voice Experience fallback for browser autoplay restrictions.
- `1.9.0` - Added premium startup animation, Home entrance motion, optional built-in browser voice guidance, and Morning Briefing controls.
- `1.8.0` - Added Phase 1 navigation shell with five primary destinations, secondary tabs, mobile bottom navigation, and More utilities.
- `1.7.0` - Added Companion customization with saved name, initials, avatar style, tone, coaching style, and preferred focus.
- `1.6.0` - Added persistent Companion drawer, grouped navigation, refreshed app shell styling, and Dashboard-first landing behavior.
- `1.5.0` - Added app-style dashboard home screen, daily missions, visual reward momentum, and chat-style LifeOps Companion interface.
- `1.1.0` - Added in-app edit modal, bill due dates, upcoming payment warnings, and empty-data test mode.
- `1.0.0` - Core local-first LifeOps dashboard with setup, money, food, fitness, wellness, goals, actions, history, reports, rule-based coach mockup, JSON export/restore, and dashboard summary.

## Future Monetization Possibilities

Potential monetization should not compromise privacy or user trust. Possible future paths:

- Free local-first version
- Paid mobile app
- Optional premium encrypted sync
- Optional advanced reporting
- Optional AI assistant tier
- Employer-ready portfolio or productivity templates

Avoid monetization tied to trading, gambling, speculative investing, or selling sensitive personal data.

## Contribution And Development Notes

- Preserve existing local data compatibility whenever possible.
- Make a backup before significant edits.
- Keep calculations transparent and easy to audit.
- Prefer small, focused changes over rewrites.
- Do not add paid services, external APIs, or account systems without a clear reason.
- Keep Version 1 stable before building later roadmap modules.
- Test after every meaningful development phase.
