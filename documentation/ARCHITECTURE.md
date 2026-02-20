# Birdy Architecture

## Overview
Birdy is a full-stack social media platform with a Node.js/Express backend and React/Vite frontend.

## Folder Structure
```
Birdy/
├── backend/
│   ├── controllers/     # Business logic handlers
│   ├── middleware/      # Auth, rate limiting
│   ├── models/          # Database query functions
│   ├── routes/          # Express route definitions
│   ├── database.js      # SQLite initialization
│   └── server.js        # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page-level components
│   │   ├── styles/      # Global CSS
│   │   └── utils/       # API client
│   └── vite.config.js
├── tests/               # Supertest integration tests
└── documentation/
```

## Layered Architecture

### Backend
- **Routes** — define URL paths, apply middleware, delegate to controllers
- **Controllers** — validate input, call models, return HTTP responses
- **Models** — encapsulate all SQL queries using prepared statements
- **Middleware** — JWT auth verification, admin checks

### Frontend
- **Pages** — top-level route components (Login, Feed, Profile, Admin)
- **Components** — reusable UI (ChirpCard, CommentSection, CreateChirp, Navbar)
- **Utils/api.js** — Axios instance with JWT interceptor

## Database
SQLite via `better-sqlite3` (synchronous API). Tables: users, chirps, comments, reactions, follows.

## Auth Flow
1. User registers/logs in → receives JWT
2. JWT stored in `localStorage`
3. Axios interceptor attaches JWT to every request
4. Server middleware verifies JWT on protected routes
