-- IndustryVerse AI: database schema (run once in Supabase SQL Editor)

-- 1) Learner progress, one row per learner per career
create table if not exists public.progress (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  career     text        not null check (char_length(career) <= 60),
  state      jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, career)
);
alter table public.progress enable row level security;

drop policy if exists "progress: read own"   on public.progress;
drop policy if exists "progress: insert own" on public.progress;
drop policy if exists "progress: update own" on public.progress;
create policy "progress: read own"   on public.progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "progress: insert own" on public.progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "progress: update own" on public.progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- 2) Referral clicks: every time a learner opens a certification link
create table if not exists public.referral_clicks (
  id            bigint generated always as identity primary key,
  user_id       uuid references auth.users(id) on delete set null,
  career        text not null check (char_length(career) <= 60),
  provider      text not null check (char_length(provider) <= 60),
  certification text not null check (char_length(certification) <= 200),
  url           text not null check (char_length(url) <= 500 and url like 'https://%'),
  clicked_at    timestamptz not null default now()
);
alter table public.referral_clicks enable row level security;

drop policy if exists "referrals: log click" on public.referral_clicks;
drop policy if exists "referrals: read own"  on public.referral_clicks;
-- anyone can log a click, but only as themselves (or anonymously)
create policy "referrals: log click" on public.referral_clicks for insert to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));
-- signed-in learners can only read their own clicks; totals are for admins in the dashboard
create policy "referrals: read own" on public.referral_clicks for select to authenticated
  using (user_id = (select auth.uid()));

grant select, insert, update on public.progress to authenticated;
grant insert on public.referral_clicks to anon, authenticated;
grant select on public.referral_clicks to authenticated;

-- 3) Referral report for the team (visible in the dashboard / SQL editor only)
create or replace view public.referral_summary with (security_invoker = true) as
  select provider, career, certification, count(*) as clicks, count(distinct user_id) as learners,
         max(clicked_at) as last_click
  from public.referral_clicks group by provider, career, certification order by clicks desc;
revoke all on public.referral_summary from anon, authenticated;
