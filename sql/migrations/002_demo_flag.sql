-- Marks questions (and, by join, their responses/feedback) as demo/seed data
-- so it can be told apart from real content and cleared in one action.

alter table questions add column if not exists is_demo boolean not null default false;
