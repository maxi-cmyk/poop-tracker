-- PooPals Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  poo_donym TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Toilet Venues (must be created before poop_logs due to FK)
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  has_bidet BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poop logs table
CREATE TABLE IF NOT EXISTS poop_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bristol_type INTEGER CHECK (bristol_type BETWEEN 1 AND 7),
  volume TEXT CHECK (volume IN ('small', 'medium', 'large', 'massive')),
  color TEXT,
  duration_seconds INTEGER,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  is_public BOOLEAN DEFAULT false,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  venue_id UUID REFERENCES venues(id),
  poop_photo_url TEXT,
  toilet_photo_url TEXT
);

-- Venue Reviews
CREATE TABLE IF NOT EXISTS venue_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  tp_quality INTEGER CHECK (tp_quality BETWEEN 1 AND 5),
  cleanliness INTEGER CHECK (cleanliness BETWEEN 1 AND 5),
  privacy INTEGER CHECK (privacy BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(venue_id, user_id)
);

-- Friends relationship
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_type)
);

-- Poop Streaks tracking
CREATE TABLE IF NOT EXISTS streaks (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_log_date DATE
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE poop_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, update only their own
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Poop logs: Users can CRUD their own, read public logs from friends
DROP POLICY IF EXISTS "Users can manage own logs" ON poop_logs;
CREATE POLICY "Users can manage own logs" ON poop_logs FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view public friend logs" ON poop_logs;
CREATE POLICY "Users can view public friend logs" ON poop_logs FOR SELECT USING (
  is_public = true AND (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM friendships 
      WHERE status = 'accepted' 
      AND ((user_id = auth.uid() AND friend_id = poop_logs.user_id)
        OR (friend_id = auth.uid() AND user_id = poop_logs.user_id))
    )
  )
);

-- Venues: Anyone can read, authenticated users can create
DROP POLICY IF EXISTS "Venues are viewable by everyone" ON venues;
CREATE POLICY "Venues are viewable by everyone" ON venues FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create venues" ON venues;
CREATE POLICY "Authenticated users can create venues" ON venues FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Venue reviews: Read all, users manage their own
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON venue_reviews;
CREATE POLICY "Reviews are viewable by everyone" ON venue_reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own reviews" ON venue_reviews;
CREATE POLICY "Users can manage own reviews" ON venue_reviews FOR ALL USING (auth.uid() = user_id);

-- Friendships: Users can see and manage their own friendships
DROP POLICY IF EXISTS "Users can view own friendships" ON friendships;
CREATE POLICY "Users can view own friendships" ON friendships FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

DROP POLICY IF EXISTS "Users can manage own friendships" ON friendships;
CREATE POLICY "Users can manage own friendships" ON friendships FOR ALL 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Achievements: Users can view all (for comparison), manage own
DROP POLICY IF EXISTS "Achievements are viewable by friends" ON user_achievements;
CREATE POLICY "Achievements are viewable by friends" ON user_achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own achievements" ON user_achievements;
CREATE POLICY "Users can manage own achievements" ON user_achievements FOR ALL USING (auth.uid() = user_id);

-- Streaks: Users manage their own
DROP POLICY IF EXISTS "Users can manage own streaks" ON streaks;
CREATE POLICY "Users can manage own streaks" ON streaks FOR ALL USING (auth.uid() = user_id);

-- Create profile on user signup (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  
  INSERT INTO public.streaks (user_id, current_streak, longest_streak)
  VALUES (new.id, 0, 0);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for photos (run separately in Storage settings)
-- Create a bucket called 'poop-photos' with public read access
