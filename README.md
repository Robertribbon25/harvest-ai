# Smart Agriculture Cooperative AI Platform

An AI-powered platform for farmers, cooperatives, and agribusinesses. Built on TanStack Start with Lovable Cloud (Postgres + Auth) and the Lovable AI Gateway for chat and computer vision.

## Features

- **Authentication** — Email/password + Google OAuth via Lovable Cloud
- **Farm & Crop Management** — Full CRUD for farms and crop cycles
- **AI Agronomy Chatbot** — Streaming assistant (English + Kinyarwanda) at `/chat`
- **Disease Scanner** — Upload leaf photos for AI diagnosis + treatment plan
- **Dashboard** — Yield trends and market price analytics (Recharts)
- **Weather & Market** — Live market and weather views (UI ready, external APIs pluggable)

## Tech Stack

- **Framework:** TanStack Start v1 (React 19, Vite 7, SSR-ready)
- **Styling:** Tailwind CSS v4 + shadcn/ui + semantic design tokens (`src/styles.css`)
- **Backend:** Lovable Cloud (managed Postgres, Auth, Storage) via `createServerFn`
- **AI:** Lovable AI Gateway (Gemini 2.5 Flash for chat, Gemini Vision for scans)
- **Routing:** File-based routes in `src/routes/`
- **Data:** TanStack Query

## Getting Started

```bash
bun install
bun run dev
```

The app runs at `http://localhost:8080`.

## Project Structure

```
src/
  routes/              # File-based routes (pages + /api endpoints)
    api/ai/            # Chat + vision server routes
  components/          # UI components (shadcn/ui based)
  hooks/               # use-auth and shared hooks
  integrations/
    supabase/          # Auto-generated Lovable Cloud client + types
  styles.css           # Design tokens (oklch) and theme
supabase/
  migrations/          # SQL migrations (profiles, farms, crops, scans, chat)
```

## Database

Tables: `profiles`, `farms`, `crops`, `chat_messages`, `disease_scans`. All protected by Row Level Security, scoped to `auth.uid()`. New users get a profile row automatically via the `handle_new_user` trigger.

## AI Endpoints

- `POST /api/ai/chat` — Streaming chat completion for agronomic Q&A
- `POST /api/ai/scan` — Image diagnosis returning structured `{ disease, confidence, treatment }`

Both run on the Lovable AI Gateway — no API key required during development.

## Roadmap

Mocked/pending integrations (need external credentials):
- Real weather data (OpenWeather)
- Mobile Money (MTN / Airtel)
- USSD + SMS (Africa's Talking)
- Voice STT/TTS

## Deployment

Click **Publish** in Lovable. The app deploys to a Cloudflare Workers edge runtime with the managed database attached automatically.

## License

MIT
