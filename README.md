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

### Migrations

Schema lives in `supabase/migrations/`. On Lovable Cloud migrations are applied automatically when you accept them in chat — no manual `supabase db push` is needed. For local CLI workflows:

```bash
# Apply all pending migrations to the linked project
supabase db push

# Pull the current remote schema into a new migration file
supabase db pull
```

### Seeding Sample Data

The project does not ship with hard-coded seed SQL — sample farms, crops, and scans are created per-user through the UI so they respect RLS (`auth.uid() = user_id`). To bootstrap a demo account:

1. Sign up at `/signup` (or use Google).
2. Create a farm at `/farms` (e.g. *Kigali Demo Farm*, 2.5 ha, Rwamagana).
3. Add a few crops at `/crops` (Maize, Beans, Cassava) with planting + expected harvest dates.
4. Run a sample scan at `/scanner` with any leaf photo to populate `disease_scans`.
5. The `/dashboard` charts will populate from the inserted rows.

If you want scripted seeding, add a `scripts/seed.ts` that calls the Supabase client with a service-role key (server-side only) and inserts rows for a specific `user_id`. Never commit the service-role key.

### Resetting the Database

> **Destructive — wipes all rows.** Use only on dev/staging.

**Option A — Per-user reset (safe, via SQL):**

```sql
delete from public.disease_scans where user_id = '<uuid>';
delete from public.chat_messages where user_id = '<uuid>';
delete from public.crops         where user_id = '<uuid>';
delete from public.farms         where user_id = '<uuid>';
```

**Option B — Full table truncate (admin):**

```sql
truncate table
  public.disease_scans,
  public.chat_messages,
  public.crops,
  public.farms
restart identity cascade;
```

**Option C — Full reset via Supabase CLI (local dev only):**

```bash
supabase db reset      # drops the local DB and re-applies every migration
```

After a reset, re-run the seeding steps above to repopulate demo data.

## Startup Scripts

| Command          | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `bun install`    | Install dependencies                                 |
| `bun run dev`    | Start the TanStack Start dev server on `:8080`       |
| `bun run build`  | Production build (Cloudflare Workers target)         |
| `bun run start`  | Run the built app locally                            |
| `bun run lint`   | ESLint over `src/`                                   |

No separate AI/worker process is required — chat and vision endpoints run inside the same TanStack server (`/api/ai/*`) backed by the Lovable AI Gateway.

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
