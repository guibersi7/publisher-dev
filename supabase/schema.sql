-- Publisher Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  full_name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'pro', 'business')),
  posts_remaining integer default 3,
  brand_profile jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Posts table
create table if not exists public.posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  content text not null,
  image_url text,
  video_url text,
  status text default 'draft' check (status in ('draft', 'scheduled', 'published')),
  scheduled_at timestamp with time zone,
  published_at timestamp with time zone,
  platform text check (platform in ('instagram', 'facebook', 'twitter', 'linkedin', 'tiktok')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chat history table
create table if not exists public.chat_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  persona_id text,
  thread_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscriptions table
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null unique,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text default 'active' check (status in ('active', 'canceled', 'past_due', 'trialing')),
  plan text default 'free' check (plan in ('free', 'pro', 'business')),
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.chat_history enable row level security;
alter table public.subscriptions enable row level security;

-- Users policies
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Enable insert for authenticated users only" on public.users
  for insert with check (auth.uid() = id);

-- Posts policies
create policy "Users can view own posts" on public.posts
  for select using (auth.uid() = user_id);

create policy "Users can create own posts" on public.posts
  for insert with check (auth.uid() = user_id);

create policy "Users can update own posts" on public.posts
  for update using (auth.uid() = user_id);

create policy "Users can delete own posts" on public.posts
  for delete using (auth.uid() = user_id);

-- Chat history policies
create policy "Users can view own chat history" on public.chat_history
  for select using (auth.uid() = user_id);

create policy "Users can create own chat messages" on public.chat_history
  for insert with check (auth.uid() = user_id);

-- Subscriptions policies
create policy "Users can view own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "Users can update own subscription" on public.subscriptions
  for update using (auth.uid() = user_id);

create policy "Enable insert for authenticated users" on public.subscriptions
  for insert with check (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists idx_posts_user_id on public.posts(user_id);
create index if not exists idx_posts_status on public.posts(status);
create index if not exists idx_posts_scheduled_at on public.posts(scheduled_at);
create index if not exists idx_chat_history_user_id on public.chat_history(user_id);
create index if not exists idx_chat_history_user_persona on public.chat_history(user_id, persona_id, created_at);
create index if not exists idx_subscriptions_stripe_customer_id on public.subscriptions(stripe_customer_id);

-- Function to automatically create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create user profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_users_updated_at before update on public.users
  for each row execute procedure public.update_updated_at_column();

create trigger update_posts_updated_at before update on public.posts
  for each row execute procedure public.update_updated_at_column();

create trigger update_subscriptions_updated_at before update on public.subscriptions
  for each row execute procedure public.update_updated_at_column();

