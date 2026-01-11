-- Fastbreak Events Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create venues table
CREATE TABLE venues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50),
  country VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  sport_type VARCHAR(50) NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for many-to-many relationship
CREATE TABLE event_venues (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, venue_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_sport_type ON events(sport_type);
CREATE INDEX idx_events_name_search ON events USING gin(to_tsvector('english', name));

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_venues ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events table
-- Anyone can view all events
CREATE POLICY "Users can view all events" ON events
  FOR SELECT USING (true);

-- Users can only insert their own events
CREATE POLICY "Users can insert own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own events
CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own events
CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for venues table
-- Anyone can view venues
CREATE POLICY "Anyone can view venues" ON venues
  FOR SELECT USING (true);

-- Authenticated users can create venues
CREATE POLICY "Authenticated users can insert venues" ON venues
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for event_venues junction table
-- Anyone can view event-venue relationships
CREATE POLICY "View all event venues" ON event_venues
  FOR SELECT USING (true);

-- Users can manage event-venue relationships for their own events
CREATE POLICY "Users can manage own event venues" ON event_venues
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_venues.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample venues
INSERT INTO venues (name, address, city, state, country, postal_code) VALUES
  ('Madison Square Garden', '4 Pennsylvania Plaza', 'New York', 'NY', 'USA', '10001'),
  ('Staples Center', '1111 S Figueroa St', 'Los Angeles', 'CA', 'USA', '90015'),
  ('Wembley Stadium', 'Wembley', 'London', NULL, 'UK', 'HA9 0WS'),
  ('Camp Nou', 'C. d''Arístides Maillol, 12', 'Barcelona', NULL, 'Spain', '08028'),
  ('Tokyo Dome', '1-3-61 Koraku', 'Tokyo', NULL, 'Japan', '112-0004'),
  ('Mercedes-Benz Stadium', '1 AMB Dr NW', 'Atlanta', 'GA', 'USA', '30313'),
  ('Fenway Park', '4 Jersey St', 'Boston', 'MA', 'USA', '02215'),
  ('Rose Bowl', '1001 Rose Bowl Dr', 'Pasadena', 'CA', 'USA', '91103'),
  ('Old Trafford', 'Sir Matt Busby Way', 'Manchester', NULL, 'UK', 'M16 0RA'),
  ('Allianz Arena', 'Werner-Heisenberg-Allee 25', 'Munich', NULL, 'Germany', '80939');