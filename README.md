# LifeOps Dashboard

## Product Summary

LifeOps is a personal life operating dashboard for managing money, health, habits, goals, tasks, wellness signals, and long-term planning from one local-first interface. The current project is a polished Version 1 static web app built as a single HTML file.

## Mission And User Problem

LifeOps is designed to help users see the connections between daily choices and longer-term stability. Many people track budgeting, fitness, food, tasks, and goals in separate places. LifeOps brings the most important daily signals into one clean dashboard so users can decide what to focus on today.

The app does not provide financial, tax, legal, medical, investing, or nutrition advice. Current recommendations are simple rule-based prompts based on the user's own logged data.

## Current Features

- Redesigned dashboard overview with LifeOps value, focused cards, trend movement, and category score cards
- Daily summary: current priority, emergency fund progress, savings, income, expenses, cash flow, tasks, habits, workouts, steps, and recommended focus
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
- LifeOps reward points, levels, streak signals, badges, and next unlock guidance
- Wellness tracking for sleep, water, mood, stress, and energy
- Daily history snapshots and trend summaries
- Weekly review and report preview/export
- Customizable local-first AI companion preview with name, tone, visual style, dashboard focus, rule-based answers, daily check-ins, and data-used explanations
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
- Upcoming payment warnings depend on due dates entered on expenses.
- Financial calculations are simple cash-flow and progress calculations only.
- The companion is rule-based and not connected to a real AI model.
- No encryption is implemented yet.
- No App Store wrapper exists yet.

## Privacy And Security Considerations

- Version 1 keeps data local and does not transmit personal information externally.
- Users should not store passwords, banking credentials, Social Security numbers, tax IDs, authentication codes, or sensitive medical details in this app.
- Exported JSON files may contain personal financial and health-related information. Store backups carefully.
- Future versions should evaluate optional encryption, passcode protection, and secure mobile storage before public release.

## Mobile And App Store Considerations

LifeOps is currently a responsive static web app. To prepare for public mobile distribution, future work should consider:

- Mobile-first navigation with fewer visible top-level sections
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

Planned modules:

- Job application tracker
- Status, salary range, interview dates, prep notes, contacts, and follow-up reminders
- School course tracker
- GPA, credits completed, credits remaining
- Tuition, financial aid, refund estimates
- Assignment and semester planning

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

### Version 5: LifeOps Assistant

Optional assistant concept:

- Answer questions using user-owned LifeOps data
- Explain which data and rules were used
- Avoid hidden or unexplained recommendations
- Start with local rule-based explanations before adding AI integration

Example questions:

- Can I afford this purchase?
- How close am I to my emergency fund goal?
- What bills are due soon?
- What should I focus on today?
- How much debt remains?
- What job applications require follow up?
- What documents do I need for taxes?

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
- Open Rewards and confirm XP, level progress, badges, and next unlock update from logged activity.
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
- Test the companion prompt buttons, manual question input, customization controls, daily check-in, and data-used panel.
- Test desktop width.
- Test common mobile widths such as 390px, 430px, and 768px.

## Version History

- `1.4.0` - Added customizable companion settings and redesigned the dashboard with a cleaner LifeOps value hero, trend bars, and focused cards.
- `1.3.0` - Added local-first LifeOps Companion preview with richer prompts, daily check-in, reward-aware answers, and data-used explanations.
- `1.2.0` - Added local LifeOps Rewards with XP, levels, streak signals, badges, next unlock guidance, and dashboard reward cards.
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
