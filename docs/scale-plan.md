# Atelier-Leads scale plan

This app is now structured so the UI can run locally today and move to Supabase/Postgres later without rewriting dashboards.

## Phase 1, completed in code

- Role model: `freelancer` and `business`.
- Profile model: every login can become a profile row.
- Requirement model: business owners post marketplace requirements.
- Lead model: requirements are converted into freelancer CRM leads.
- Repository layer: `src/lib/platform.ts` centralizes profiles, leads, requirements, and stats.
- Current provider: localStorage fallback for GitHub Pages.
- Future provider: Supabase/Postgres using the schema below.

## Supabase environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Tables

```sql
create type user_role as enum ('freelancer', 'business', 'admin');
create type service_intent as enum ('Website', 'SEO', 'Google Profile', 'AI Chatbot');
create type requirement_status as enum ('Open', 'Matched', 'In Progress', 'Completed', 'Archived');
create type lead_status as enum ('Discovered', 'Contacted', 'Replied', 'Call Booked', 'Won', 'Lost');

create table profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text not null,
  email text not null unique,
  role user_role not null,
  company text,
  created_at timestamptz not null default now()
);

create table requirements (
  id uuid primary key default gen_random_uuid(),
  business text not null,
  owner text,
  city text,
  phone text,
  email text,
  budget text,
  service service_intent not null,
  requirement text not null,
  status requirement_status not null default 'Open',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  requirement_id uuid references requirements(id) on delete set null,
  business text not null,
  niche text not null,
  city text,
  website text,
  issue text,
  email text,
  service service_intent not null,
  source text not null default 'Prospecting',
  score int not null default 50,
  status lead_status not null default 'Discovered',
  assigned_to uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  requirement_id uuid not null references requirements(id) on delete cascade,
  freelancer_id uuid not null references profiles(id) on delete cascade,
  pitch text not null,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  unique(requirement_id, freelancer_id)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  requirement_id uuid references requirements(id) on delete cascade,
  sender_id uuid references profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);
```

## Row level security idea

- Business owners can insert and read their own requirements.
- Freelancers can read open requirements and their assigned leads.
- Admin can read/update everything.
- Applications are readable by the applicant, requirement owner, and admin.

## Next scale phases

1. Replace localStorage repository functions with Supabase queries.
2. Add real auth provider using Supabase Auth or Clerk.
3. Add freelancer application flow for requirements.
4. Add admin moderation dashboard.
5. Add paid lead boosts, notifications, and AI matching.
