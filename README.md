# LifeOps

LifeOps is a local-first personal operating system prototype for tracking money, goals, habits, health, education, career, relationships, documents, and daily planning from one premium dashboard.

Current version: v1.31.1

## What is included

- Premium black and gold LifeOps dashboard
- Interactive life tree with category nodes
- Atlas local companion orb and panel
- Life Score market-style trend card
- Goals, finances, health, education, career, calendar, notes, integrations, privacy, and sharing prototype sections
- Local-only storage using browser localStorage
- JSON export/import support inside the app
- Local brand assets in `assets/brand`

## How to run locally

Open `index.html` or `lifeops-dashboard.html` in a browser.

For a local preview server, run:

```bash
node lifeops-preview-server.js 4198
```

Then open:

```text
http://127.0.0.1:4198/lifeops-dashboard.html
```

## Data and privacy

This version stores data locally in the browser. It does not connect to real banks, health apps, calendars, email, AI APIs, or cloud services.

Do not store passwords, Social Security numbers, banking credentials, access tokens, or highly sensitive documents in this prototype.

## GitHub upload note

Upload only the files in this folder. Do not upload local backups, private JSON exports, screenshots, test folders, or old package folders.

## Future roadmap

- Real account system
- Secure database and cloud backup
- Real AI backend with privacy controls
- Real calendar and task integrations
- Health and fitness integrations
- Mobile app packaging
- Production security review
