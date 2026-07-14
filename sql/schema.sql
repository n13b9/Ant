-- Interview portal schema. Run this against the Supabase/Postgres database
-- pointed to by DATABASE_URL before starting the app.

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  model text not null,
  content text not null,
  prompt_version text,
  created_at timestamptz not null default now()
);

create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  label text,
  expires_at timestamptz,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  response_id uuid not null references responses(id) on delete cascade,
  invite_id uuid not null references invites(id) on delete cascade,
  rating smallint not null check (rating between 1 and 4), -- 1=Poor 2=Okay 3=Good 4=Excellent
  comment text,
  created_at timestamptz not null default now(),
  unique (response_id, invite_id)
);

create index if not exists idx_responses_question_id on responses(question_id);
create index if not exists idx_feedback_response_id on feedback(response_id);
create index if not exists idx_feedback_invite_id on feedback(invite_id);
