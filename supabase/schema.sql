create table if not exists providers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  description text not null,
  address text,
  phone text,
  email text,
  instagram text,
  created_at timestamptz default now()
);

create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  provider_id uuid references providers(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade,
  author text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  date date not null default current_date,
  created_at timestamptz default now()
);

-- Profiles table — one row per authenticated user (mirrors auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  display_name text,
  created_at timestamptz default now()
);

-- Auto-create a profile row whenever a new user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Row level security
alter table providers enable row level security;
alter table reviews enable row level security;
alter table profiles enable row level security;

create policy "Anyone can read providers"
  on providers for select using (true);

create policy "Anyone can read reviews"
  on reviews for select using (true);

create policy "Authenticated users can insert reviews"
  on reviews for insert with check (auth.role() = 'authenticated' and user_id = auth.uid());

create policy "Users can read their own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);
