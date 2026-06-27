# ◈ DevPulse

> See what your GitHub profile actually says about you.

An AI-powered analyzer that reads your public GitHub data and gives you
a straight-talking breakdown of your skills, consistency, and gaps.

**Live demo:** _coming Day 9_

---

## Tech stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React, CSS custom properties      |
| Backend   | Node.js, Express                  |
| Data      | GitHub REST API                   |
| AI        | Anthropic Claude API              |
| Deploy    | Vercel (frontend) · Railway (backend) |

---

## Run locally

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/devpulse.git
cd devpulse

# 2. Frontend
cd frontend
npm install
npm start          # → http://localhost:3000

# 3. Backend (new terminal)
cd ../backend
cp .env.example .env   # add your GitHub + Anthropic keys
npm install
npm start          # → http://localhost:5000
```

---

## Build log

- [x] Day 1 — Project setup · React scaffold · folder structure · backend skeleton
- [ ] Day 2 — GitHub API integration
- [ ] Day 3 — Profile UI
- [ ] Day 4 — Backend & API proxy
- [ ] Day 5 — Claude AI analysis
- [ ] Day 6 — Charts & visualization
- [ ] Day 7 — UI polish & responsive
- [ ] Day 8 — Shareable profile cards
- [ ] Day 9 — Deployment (Vercel + Railway)
- [ ] Day 10 — Docs & resume polish

---

## Project structure

```
devpulse/
├── frontend/
│   └── src/
│       ├── pages/         ← full-page views
│       ├── components/    ← reusable UI pieces
│       ├── services/      ← API call functions
│       ├── hooks/         ← custom React hooks
│       └── utils/         ← pure helper functions
└── backend/
    └── server.js          ← Express API server
```
