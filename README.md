# HyperReach AI

AI-Powered Hyper-Personalized Outreach Platform

## Overview

HyperReach AI turns websites, GitHub profiles, LinkedIn screenshots, and company context into highly personalized outreach messages and replies. Users define offerings, customize prompts, save prospects, and generate messages that sound like a real human wrote them specifically for each person.

## Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **PostgreSQL** (Neon) + **Drizzle ORM**
- **Better Auth** (Email + Password authentication)
- **OpenCode Go API** (AI message generation)
- **Firecrawl** (Web scraping)
- **Cloudinary** (Image uploads)
- **shadcn/ui** + **Tailwind CSS v4** + **Framer Motion**

## Local Setup

```bash
# Clone the repo
git clone <repo-url>
cd personalized-outreach-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your .env.local values (see Environment Variables below)

# Push database schema to Neon
npm run db:push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
DATABASE_URL=            # Neon PostgreSQL connection string
BETTER_AUTH_SECRET=      # Generate with: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
OPENCODE_GO_API_KEY=     # OpenCode Go API key for AI generation
FIRECRAWL_API_KEY=       # Firecrawl API key for web scraping
CLOUDINARY_CLOUD_NAME=   # Cloudinary cloud name
CLOUDINARY_API_KEY=      # Cloudinary API key
CLOUDINARY_API_SECRET=   # Cloudinary API secret
```

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── layout.tsx        # Sidebar layout with auth guard
│   │   ├── dashboard/        # Overview with stats
│   │   ├── offerings/        # CRUD + scrape
│   │   ├── prompts/          # CRUD + set default
│   │   ├── prospects/        # CRUD + sources
│   │   ├── generate/         # Message generation
│   │   ├── messages/         # Message history
│   │   └── analytics/        # Usage metrics
│   ├── api/auth/[...all]/   # Better Auth handler
│   ├── login/               # Sign in page
│   ├── signup/              # Sign up page
│   └── page.tsx             # Landing page
├── db/
│   ├── schema/             # Drizzle schema (auth, enums, tables)
│   └── index.ts            # DB connection
├── features/               # Domain actions (server actions)
│   ├── offerings/actions.ts
│   ├── prompts/actions.ts
│   ├── prospects/actions.ts
│   ├── messages/actions.ts
│   ├── conversations/actions.ts
│   └── analytics/actions.ts
├── lib/
│   ├── auth/               # Better Auth config + client + session
│   ├── ai/                 # OpenCode Go integration
│   ├── firecrawl/          # Web scraping
│   ├── github/             # GitHub API
│   ├── cloudinary/         # Image upload
│   └── utils/              # cn(), env validation
├── components/
│   ├── layout/sidebar.tsx  # Dashboard sidebar
│   └── ui/                 # shadcn/ui components
└── middleware.ts           # Auth-protected routes
```

## Architecture Decisions

### Feature-based structure
Each domain (offerings, prompts, prospects, messages) has its own action file with server actions. This keeps related logic collocated rather than scattered across API route handlers.

### Better Auth with Drizzle
Better Auth manages user, session, account, and verification tables. All application tables use `text` user IDs (matching Better Auth) with foreign keys to the `user` table.

### OpenCode Go as AI provider
Uses OpenCode Go API endpoint (`https://api.opencode.ai/v1`) with OpenAI SDK compatibility. Three core functions:
- `generateCompletion(system, user, options)` — raw AI calls
- `summarizeContent(content)` — condenses scraped content
- `buildOutreachMessage(offering, prompt, prospect)` — generates personalized messages

### Flexible prospect sources
Prospects can have multiple sources (GitHub, website, company website, LinkedIn screenshot, custom). Each source is scraped independently, and content is combined into `rawContent` and `aiSummary` fields on the prospect.

### Server Actions over API routes
All data mutations use Next.js Server Actions (`"use server"`) rather than separate API routes. This simplifies the client-server contract and enables progressive enhancement.

## Tradeoffs

1. **Server Actions vs REST API**: Server Actions simplify the codebase but couple the client to Next.js. A REST API would be more portable but adds boilerplate.

2. **Better Auth session-based auth vs JWT**: Better Auth uses database sessions by default. This adds a DB query per request but provides immediate session revocation.

3. **Single AI provider (OpenCode Go)**: Currently uses one provider. The AI module abstracts calls behind `generateCompletion()` making it easy to swap providers later.

4. **No pagination**: Lists of offerings, prospects, etc. load all records. Adequate for the MVP scale but would need cursor-based pagination for production.

5. **Inline AI summarization**: Scraped content is summarized immediately when adding a source. This means the AI call happens synchronously during form submission.

## What I'd Do With More Time

- **Pagination** on all list views
- **Real-time message streaming** (SSE) instead of waiting for full generation
- **Conversation thread UI** with inline reply handling
- **Rate limiting** on AI generation calls
- **Background jobs** (e.g., via Inngest or Trigger.dev) for scraping and summarization
- **More analytics**: message rating trends, offering effectiveness, response rates
- **Team support**: multi-tenant auth with organizations
- **Export**: CSV/JSON export of messages and prospects
- **Webhook integrations**: send messages directly to LinkedIn/email

## Example Generations

### Input

**Offering:** Kakiyo — AI sales automation that handles the full LinkedIn conversation including qualification.

**Prompt:** Conversational tone, under 100 words. Lead with a relevant observation about the prospect. Never sound salesy. End with a soft question.

**Prospect:** Sarah, sales engineer at a B2B SaaS company. Recently posted about outreach volume problems. Her company sells to mid-market teams.

### Output

> Hey Sarah, saw your post about the outreach volume problem last week. Funny timing — I've been building something that a few sales engineers have been using to handle exactly that. Kakiyo runs the full LinkedIn conversation for you, qualification and all. Worth a quick look?

## Deployment

The app is configured for Vercel deployment:

1. Push to GitHub
2. Connect repo in Vercel
3. Set all environment variables in Vercel dashboard
4. Deploy

The `db:push` command should be run once after the first deployment to set up the database schema.

## License

MIT