<div align="center">

# DevPulse

### GitHub Portfolio Analyzer built with React, Node.js, Express, and the GitHub REST API

Analyze any public GitHub profile and generate developer insights, language statistics, repository analytics, contribution activity, and a recruiter-friendly portfolio summary.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-devplus--xi.vercel.app-4d6bfe?style=for-the-badge)](https://devplus-xi.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46c3a0?style=for-the-badge)](https://devplus-backend.onrender.com/health)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-5fa04e?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

### 🚀 Live Demo

https://devplus-xi.vercel.app

</div>

---

# Overview

DevPulse is a full-stack web application that analyzes any public GitHub profile and transforms raw GitHub data into meaningful developer insights.

Instead of simply displaying repositories, DevPulse evaluates developer activity, programming languages, repository quality, contribution consistency, and project impact using deterministic scoring algorithms built entirely on GitHub data.

The application uses a secure backend to communicate with the GitHub REST API, protecting API credentials while improving performance through server-side caching.

---

# Features

## Developer Analytics

- Developer score (0–100)
- Activity analysis
- Repository impact analysis
- Contribution consistency
- Language diversity score

## Repository Insights

- Top repositories
- Stars & forks summary
- Repository language breakdown
- Technology topics
- Documentation quality checks

## Visual Analytics

- SVG language donut chart
- Developer score radar chart
- Repository stars chart
- 90-day contribution heatmap
- Activity timeline

## Profile Utilities

- Recruiter-friendly profile summary
- Downloadable SVG profile card
- Print-friendly PDF export
- Shareable profile URLs
- Responsive interface
- Toast notification system

---

# Architecture

```
React Frontend
       │
       │
 REST API Requests
       │
       ▼
Express Backend
       │
       ├── Cache Layer
       ├── Rate Limiter
       ├── Security Middleware
       │
       ▼
GitHub REST API
```

---

# Tech Stack

## Frontend

- React 18
- JavaScript
- HTML5
- CSS3
- Pure SVG
- React Context API

## Backend

- Node.js
- Express
- GitHub REST API
- Node Cache
- Helmet
- Morgan

## Deployment

- Vercel
- Render

---

# Project Structure

```
devplus/

├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── context/
│
├── backend/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── server.js
│
├── render.yaml
├── vercel.json
└── README.md
```

---

# API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/health` | Server status |
| GET | `/api/github/:username` | Analyze GitHub profile |
| DELETE | `/api/github/:username` | Clear cached profile |
| GET | `/api/github/meta/rate-limit` | GitHub API quota |

---

# Local Setup

## Prerequisites

- Node.js 18+
- Git
- GitHub Personal Access Token

Clone the repository

```bash
git clone https://github.com/saurabhPendam/devplus.git

cd devplus
```

Backend

```bash
cd backend

cp .env.example .env

npm install

npm start
```

Frontend

```bash
cd frontend

npm install

npm start
```

---

# Environment Variables

Backend

```
GITHUB_TOKEN=your_token_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Frontend

```
REACT_APP_API_URL=http://localhost:5000
```

---

# Deployment

## Frontend

- Vercel

## Backend

- Render

The frontend communicates only with the Express backend. All GitHub API requests are securely handled server-side to protect API credentials.

---

# Performance Optimizations

- Server-side caching (5-minute TTL)
- Parallel GitHub API requests
- Lightweight SVG visualizations
- Responsive design
- Backend rate limiting
- Secure HTTP headers
- Optimized API payloads

---

# Future Improvements

- GitHub OAuth login
- Repository comparison
- Organization analytics
- Historical developer trends
- Dark/Light theme toggle
- AI-assisted repository summaries

---

# License

This project is licensed under the MIT License.