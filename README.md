# SkillApply AI

Post-training AI coaching tool for soft skills programs. Participants select a real workplace situation, add context, and receive structured coaching guidance based on uploaded training content.

---

## Tech Stack

- **Next.js 15** (App Router)
- **Supabase** (Postgres database)
- **Anthropic Claude Sonnet** (AI coaching)
- **Tailwind CSS**
- **Vercel** (deployment)

---

## Setup Instructions

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL editor, run the contents of `supabase-setup.sql`
3. Note your **Project URL**, **anon key**, and **service role key** from Settings → API

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=choose-a-strong-password
```

### 4. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## How to use

### Admin setup (do this first)

1. Go to `/admin`
2. Enter your admin password
3. Paste the full training module content
4. Click **Save content & generate cards**
5. The AI generates 5 situation cards — these appear on the home page for all participants

### Participant flow

1. Visit the home page
2. Select a situation card (or choose "My situation is different")
3. Fill in what happened and the desired outcome
4. Click **Get coaching guidance**
5. Receive a 6-part structured coaching response

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Import into [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy

---

## Project Structure

```
skillapply-ai/
├── app/
│   ├── page.tsx              # Home page (server component)
│   ├── coach/page.tsx        # Coaching form + response
│   ├── admin/page.tsx        # Admin panel
│   └── api/
│       ├── cards/route.ts         # GET situation cards
│       ├── save-content/route.ts  # POST save training content
│       ├── generate-cards/route.ts # POST generate cards via AI
│       └── get-coaching/route.ts  # POST get coaching response
├── components/
│   ├── SituationCards.tsx    # Card grid (client)
│   └── CoachForm.tsx         # Form + response display (client)
├── lib/
│   ├── supabase.ts           # Supabase clients
│   ├── anthropic.ts          # Anthropic client + prompts
│   └── types.ts              # Shared TypeScript types
├── supabase-setup.sql        # Run once in Supabase SQL editor
└── .env.local.example        # Environment variable template
```

---

## Guardrails

The AI will only coach on:
- Workplace communication
- Soft skills
- Customer handling
- Conflict resolution
- Feedback conversations
- Persuasion and influence
- Emotional control
- Professional behaviour

It will not give legal, medical, financial, or HR policy advice.

---

## Version 2 Ideas

- Participant login (Supabase Auth)
- Session history per participant
- Analytics dashboard (top situations, drop-off rates)
- Company-wise access / multi-tenant
- Module-level filtering
- PDF export of coaching response
- WhatsApp or email delivery of response
