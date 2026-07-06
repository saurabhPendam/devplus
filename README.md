# DevPulse

A GitHub portfolio analyzer that gives developers a data-driven breakdown
of their activity, languages, consistency, and how their profile looks to
recruiters — no AI API required.

**Live demo:** [devpulse.vercel.app](https://devpulse.vercel.app)  
**Backend API:** [devpulse-backend.up.railway.app/health](https://devpulse-backend.up.railway.app/health)

---

## Tech stack

| Layer     | Technology                                   |
|-----------|----------------------------------------------|
| Frontend  | React, CSS custom properties, pure SVG charts |
| Backend   | Node.js, Express, node-cache                 |
| Data      | GitHub REST API + Events API                 |
| Deploy    | Vercel (frontend) · Railway (backend)        |

---

## Features

- **Developer score** — 0–100 across activity, impact, diversity, consistency
- **Commit heatmap** — 90-day grid from the real GitHub Events API
- **Language charts** — SVG donut chart + ranked bar list
- **Score radar** — spider chart of all 4 score dimensions
- **Repo stars chart** — horizontal bar chart of top repos
- **Profile insights** — rule-based observations from your data
- **Shareable card** — downloadable SVG to embed in your README
- **PDF export** — clean A4 layout via browser print
- **Recruiter summary** — copy-pasteable paragraph generated from data

---

## Run locally

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/devpulse.git
cd devpulse

# 2. Backend
cd backend
cp .env.example .env        # fill in GITHUB_TOKEN
npm install
npm start                   # http://localhost:5000

# 3. Frontend (new terminal)
cd frontend
npm install
npm start                   # http://localhost:3000
```

---

## Deploy

### Backend → Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. New Project → Deploy from GitHub repo → select `devpulse`
3. Railway detects Node.js automatically via `railway.json`
4. Add environment variables in **Settings → Variables**:
   ```
   GITHUB_TOKEN   =  ghp_your_token_here
   CLIENT_URL     =  https://your-app.vercel.app   (add after Vercel deploy)
   NODE_ENV       =  production
   ```
5. Railway gives you a URL like `https://devpulse-backend-production.up.railway.app`
6. Test it: visit `https://your-backend.up.railway.app/health`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. New Project → Import `devpulse` → set **Root Directory** to `frontend`
3. Vercel detects Create React App automatically via `vercel.json`
4. Add environment variable in **Settings → Environment Variables**:
   ```
   REACT_APP_API_URL = https://your-backend.up.railway.app
   ```
5. Click Deploy — Vercel gives you a URL like `https://devpulse.vercel.app`
6. Go back to Railway → add `CLIENT_URL=https://devpulse.vercel.app`
7. Redeploy the Railway service so CORS picks up the new origin

---

## Project structure

```
devpulse/
├── frontend/
│   ├── vercel.json              ← Vercel deploy config
│   ├── .env.development         ← local API URL (safe to commit)
│   ├── .env.production          ← Railway API URL (safe to commit)
│   └── src/
│       ├── components/          ← all UI components + charts
│       ├── pages/               ← SearchPage, ProfilePage
│       ├── hooks/               ← useProfile
│       ├── services/            ← api.js (all fetch calls)
│       └── utils/               ← score.js, insights.js, export.js, format.js
└── backend/
    ├── railway.json             ← Railway deploy config
    ├── server.js                ← Express entry point
    ├── routes/github.js         ← API route handlers
    ├── services/github.js       ← GitHub API calls + caching
    ├── services/cache.js        ← node-cache wrapper
    └── middleware/              ← validate, rateLimit, errorHandler
```

---

## Build log

- [x] Day 1  — Project setup, React scaffold, backend skeleton
- [x] Day 2  — GitHub API integration, profile/repo/language data
- [x] Day 3  — Developer score, insights engine, UI components
- [x] Day 4  — Backend caching, rate limiting, error handling
- [x] Day 5  — Events API heatmap, topics cloud, recruiter card
- [x] Day 6  — SVG charts: donut, radar, stars bar, activity tooltips
- [x] Day 7  — Loading screen, toast system, responsive design, print CSS
- [x] Day 8  — SVG profile card download, PDF export, shareable links
- [x] Day 9  — Deployed to Vercel + Railway
