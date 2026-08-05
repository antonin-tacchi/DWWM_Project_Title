# 🎨 Clap! Frontend

React frontend for the **Clap!** movie and TV discovery platform.

This application provides the user interface for browsing movies and series, managing personal content, interacting with the platform, and accessing administrative features.

---

## Overview

The frontend is built as a **Single Page Application (SPA)** using React and Vite.

It communicates exclusively through the API Gateway and provides:

- Movie and TV browsing
- Search and filtering
- Ratings and comments
- Favorites and playlists
- Notifications
- Gamified user profiles
- Multi-language support
- Admin dashboard
- Animated and interactive UI

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite 5 | Build tool |
| Tailwind CSS 3 | Styling |
| React Router 6 | Routing |
| TanStack Query 5 | API state & caching |
| Zustand | Authentication state |
| Axios | HTTP client |
| Framer Motion | Animations |
| i18next | Internationalization |
| Three.js / R3F | 3D effects |
| Vitest + Testing Library | Unit testing |

---

## Architecture

Frontend requests are routed through the Gateway.

```text
Browser
↓
Frontend (React)
↓
Gateway :8080
↓
Microservices
```

No microservice is accessed directly from the browser.

---

## Installation

Install dependencies:

```bash
npm install
```

Create a local environment file from `.env.example` and set the public Turnstile site key:

```env
VITE_TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
```

For local tests, Cloudflare's visible dummy site key is:

```env
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

Run development server:

```bash
npm run dev
```

Default:

```text
http://localhost:5173
```

---

## Available Scripts

Run development mode:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Lint code:

```bash
npm run lint
```

---

## Testing

Run tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Coverage:

```bash
npm run test:coverage
```

Current tests include:

- authStore
- NotFound page

---

## Folder Structure

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── locales/
│   └── tests/
├── nginx.conf
├── vite.config.js
└── package.json
```

---

## Features

### Authentication

Authentication state is managed using Zustand and JWT.

Features:

- Login
- Registration
- Protected routes
- Role-based access

---

### Internationalization

Supported languages:

- English
- French

Powered by:

```text
i18next + react-i18next
```

---

## Production Build

Create optimized build:

```bash
npm run build
```

Output:

```text
dist/
```

Served through Nginx in Docker deployment.

---

## Related Services

Frontend communicates with:

- gateway
- auth-service
- movies-service
- social-service
- notifications-service

through the API Gateway.

---

## Author

Antonin Tacchi
