# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm dev      # Start development server (http://localhost:3000)
pnpm build    # Production build
pnpm start    # Run production server
pnpm lint     # Run ESLint
```

Package manager: pnpm

## Architecture Overview

**Publisher** is a Next.js 14 App Router application for AI-powered social media post generation and scheduling. The UI is in Brazilian Portuguese.

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components (Radix UI primitives)
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth (Google OAuth, email/password)
- **AI**: Groq (llama-3.3-70b-versatile model) for post generation
- **Payments**: Stripe subscriptions
- **State**: TanStack Query for server state, Zustand for client state

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Protected routes (layout with sidebar)
│   │   └── dashboard/      # Main dashboard pages (chat, schedule, settings, billing)
│   ├── api/                # API Routes
│   │   ├── generate-posts/ # AI post generation endpoint
│   │   ├── stripe/         # Checkout, portal, webhook
│   │   └── user/           # User profile updates
│   ├── auth/               # OAuth callback
│   └── login/              # Public login page
├── components/
│   ├── motion/             # Framer Motion animation wrappers
│   ├── providers.tsx       # QueryClient + AuthProvider setup
│   └── ui/                 # shadcn/ui components
├── hooks/
│   └── use-posts.ts        # TanStack Query hooks for posts CRUD
├── lib/
│   ├── auth/
│   │   └── auth-context.tsx # AuthProvider with useAuth() hook
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client (singleton)
│   │   ├── server.ts       # Server Component Supabase client
│   │   └── middleware.ts   # Middleware Supabase client
│   └── utils.ts            # cn() helper, date formatters
├── middleware.ts           # Auth protection for /dashboard, /chat, /schedule, /settings
└── types/
    ├── database.ts         # Supabase Database types (users, posts, chat_history, subscriptions)
    └── index.ts            # App-level types (GeneratedPost, Plan, etc.)
```

### Key Patterns

**Supabase Client Usage**:
- Browser components: `createClient()` from `@/lib/supabase/client`
- Server Components: `createServerClient()` from `@/lib/supabase/server`
- API Routes: `createRouteHandlerClient()` from `@supabase/auth-helpers-nextjs`
- Middleware: `createMiddlewareClient()` from `@supabase/auth-helpers-nextjs`

**Authentication**:
- `useAuth()` hook provides: `user`, `profile`, `session`, `loading`, `signInWithGoogle`, `signOut`, etc.
- Protected routes are enforced in `middleware.ts` (redirects to `/login`)
- User profiles are created automatically via Supabase trigger on auth.users insert

**Data Fetching**:
- Use TanStack Query hooks in `src/hooks/use-posts.ts` for posts CRUD
- Query keys follow pattern: `['posts']`, `['posts', id]`, `['posts', 'status', status]`

**Styling**:
- Use `cn()` utility from `@/lib/utils` to merge Tailwind classes
- Brand colors: `warm-white`, `warm-black`, `warm-gray`, `orange-accent` (defined in tailwind.config.ts)
- CSS variables for semantic colors (background, foreground, primary, etc.) in globals.css

### Database Schema

Four main tables (all with RLS enabled):
- `users`: id, email, full_name, avatar_url, plan, posts_remaining
- `posts`: id, user_id, title, content, image_url, status (draft/scheduled/published), scheduled_at, platform
- `chat_history`: id, user_id, role (user/assistant), content
- `subscriptions`: id, user_id, stripe_customer_id, stripe_subscription_id, status, plan

Schema SQL is in `supabase/schema.sql`.

### Environment Variables

Required in `.env.local` (see `env.example.txt`):
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY` (for AI post generation)
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`
