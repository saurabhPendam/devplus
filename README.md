# DevPulse

A GitHub portfolio analyzer. Enter any GitHub username and get a breakdown
of skills, activity, languages, and how the profile looks to recruiters.

**Live demo:** https://devpulse.vercel.app  
**API:** https://devpulse-backend.onrender.com/health

---

## Stack

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Frontend | React, CSS, pure SVG charts                   |
| Backend  | Node.js, Express, node-cache                  |
| Data     | GitHub REST API + Events API                  |
| Deploy   | Vercel (frontend) · Render (backend) — both free |

---

## Run locally

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/devpulse.git
cd devpulse

# 2. Backend  
cd backend
cp .env.example .env      # paste your GITHUB_TOKEN
npm install
npm start                 # → http://localhost:5000

# 3. Frontend (new terminal)
cd ../frontend
npm install
npm start                 # → http://localhost:3000
```

---

## Deploy (both free, no credit card)

### Backend → Render.com

1. Go to **render.com** → sign up with GitHub
2. New + → Web Service → connect your `devpulse` repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add environment variables:
   - `GITHUB_TOKEN` = your GitHub token
   - `NODE_ENV` = `production`
5. Click **Create Web Service**
6. Your URL: `https://devpulse-backend.onrender.com`

### Frontend → Vercel.com

1. Go to **vercel.com** → sign up with GitHub
2. New Project → import `devpulse` repo
3. Set **Root Directory** = `frontend`
4. Add environment variable:
   - `REACT_APP_API_URL` = `https://devpulse-backend.onrender.com`
5. Deploy
6. Your URL: `https://devpulse.vercel.app`

### Back on Render — add CORS

In Render → your service → Environment:
- Add `CLIENT_URL` = `https://devpulse.vercel.app`
- Render auto-redeploys

### Keep backend awake (free)

Render free tier sleeps after 15 min of inactivity.
Fix: go to **uptimerobot.com** (free) → New Monitor:
- Type: HTTP(S)
- URL: `https://devpulse-backend.onrender.com/health`
- Interval: every 5 minutes

Backend stays awake permanently at zero cost.

---

## Project structure

```
devpulse/
├── render.yaml                  ← Render deploy config
├── vercel.json                  ← Vercel deploy config
├── frontend/
│   ├── .env.development         ← localhost:5000
│   ├── .env.production          ← Render URL
│   └── src/
│       ├── components/          ← UI + charts (SVG, no libraries)
│       ├── pages/               ← SearchPage, ProfilePage
│       ├── hooks/               ← useProfile
│       ├── services/            ← api.js
│       └── utils/               ← score, insights, export, format
└── backend/
    ├── Procfile                 ← web: node server.js
    ├── server.js                ← Express + helmet + morgan + CORS
    ├── routes/github.js         ← GET /api/github/:username
    ├── services/github.js       ← GitHub API + caching
    ├── services/cache.js        ← node-cache, 5 min TTL
    └── middleware/              ← validate, rateLimit, errorHandler
```

---

## Build log

- [x] Day 1  — Project setup, React scaffold, backend skeleton
- [x] Day 2  — GitHub API integration
- [x] Day 3  — Score engine, insights, UI components
- [x] Day 4  — Caching, rate limiting, error handling
- [x] Day 5  — Events API, topics, recruiter card
- [x] Day 6  — SVG charts: donut, radar, stars bar, heatmap
- [x] Day 7  — Loading screen, toasts, mobile responsive
- [x] Day 8  — SVG card download, PDF export
- [x] Day 9  — Deployed free on Vercel + Render
