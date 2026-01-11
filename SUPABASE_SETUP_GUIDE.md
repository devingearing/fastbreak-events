# Supabase Setup Guide for Fastbreak Events

This guide walks you through setting up Supabase for the Fastbreak Events project using the Supabase Dashboard.

## Prerequisites
- A Supabase account (free at https://supabase.com)
- The fastbreak-events project created locally

## Step 1: Create a New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New project"
3. Fill in the project details:
   - **Name**: fastbreak-events
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest to you
   - **Plan**: Free tier is fine for development
4. Click "Create new project" and wait for setup (takes 2-3 minutes)

## Step 2: Get Your API Keys

1. Once your project is created, go to Settings (gear icon) → API
2. Copy these values to your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## Step 3: Set Up Authentication

1. Go to Authentication → Providers
2. Email Auth should be enabled by default
3. To enable Google Auth:
   - Click on Google
   - Toggle "Enable Google provider"
   - You'll need to set up OAuth credentials in Google Cloud Console
   - Add the redirect URL shown to your Google OAuth settings
   - Add your Google Client ID and Secret

## Step 4: Create Database Tables

### Option A: Using the SQL Editor (Recommended)
1. Go to SQL Editor in the left sidebar
2. Click "New query"
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click "Run" to execute

### Option B: Using the Table Editor (Visual)

#### Create Venues Table
1. Go to Database → Tables
2. Click "New table"
3. Table name: `venues`
4. Enable RLS: ✓
5. Add columns:
   - `id` (uuid, primary key, default: uuid_generate_v4())
   - `name` (varchar(255), not null)
   - `address` (text, not null)
   - `city` (varchar(100), not null)
   - `state` (varchar(50), nullable)
   - `country` (varchar(100), not null)
   - `postal_code` (varchar(20), nullable)
   - `created_at` (timestamptz, default: now())
   - `updated_at` (timestamptz, default: now())
6. Click "Save"

#### Create Events Table
1. Click "New table"
2. Table name: `events`
3. Enable RLS: ✓
4. Add columns:
   - `id` (uuid, primary key, default: uuid_generate_v4())
   - `user_id` (uuid, not null, foreign key to auth.users.id, on delete cascade)
   - `name` (varchar(255), not null)
   - `sport_type` (varchar(50), not null)
   - `event_date` (timestamptz, not null)
   - `description` (text, nullable)
   - `created_at` (timestamptz, default: now())
   - `updated_at` (timestamptz, default: now())
5. Click "Save"

#### Create Event_Venues Junction Table
1. Click "New table"
2. Table name: `event_venues`
3. Enable RLS: ✓
4. Add columns:
   - `event_id` (uuid, foreign key to events.id, on delete cascade)
   - `venue_id` (uuid, foreign key to venues.id, on delete cascade)
5. Set composite primary key on (event_id, venue_id)
6. Click "Save"

## Step 5: Set Up Row Level Security (RLS) Policies

### Events Table Policies
1. Go to Authentication → Policies
2. Click on the `events` table
3. Create these policies:

**Policy 1: View all events**
- Name: "Users can view all events"
- Policy command: SELECT
- Target roles: public
- Using expression: `true`

**Policy 2: Insert own events**
- Name: "Users can insert own events"
- Policy command: INSERT
- Target roles: authenticated
- With check expression: `auth.uid() = user_id`

**Policy 3: Update own events**
- Name: "Users can update own events"
- Policy command: UPDATE
- Target roles: authenticated
- Using expression: `auth.uid() = user_id`

**Policy 4: Delete own events**
- Name: "Users can delete own events"
- Policy command: DELETE
- Target roles: authenticated
- Using expression: `auth.uid() = user_id`

### Venues Table Policies
1. Click on the `venues` table
2. Create these policies:

**Policy 1: View venues**
- Name: "Anyone can view venues"
- Policy command: SELECT
- Target roles: public
- Using expression: `true`

**Policy 2: Insert venues**
- Name: "Authenticated users can insert venues"
- Policy command: INSERT
- Target roles: authenticated
- With check expression: `auth.uid() IS NOT NULL`

### Event_Venues Table Policies
1. Click on the `event_venues` table
2. Create these policies:

**Policy 1: View event venues**
- Name: "View all event venues"
- Policy command: SELECT
- Target roles: public
- Using expression: `true`

**Policy 2: Manage own event venues**
- Name: "Users can manage own event venues"
- Policy command: ALL
- Target roles: authenticated
- Using expression:
```sql
EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_venues.event_id
  AND events.user_id = auth.uid()
)
```

## Step 6: Add Sample Venues (Optional)

1. Go to Table Editor → venues
2. Click "Insert" → "Insert row"
3. Add some sample venues:
   - Madison Square Garden (New York)
   - Staples Center (Los Angeles)
   - Wembley Stadium (London)
   - etc.

## Step 7: Generate TypeScript Types

1. Install Supabase CLI:
   ```bash
   npm install -D supabase
   ```

2. Generate types:
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
   ```

   Find your project ID in Settings → General → Reference ID

## Step 8: Test Your Setup

1. Go to Authentication → Users
2. Create a test user with email/password
3. Use this to test login functionality

## Troubleshooting

### Common Issues

**RLS policies not working:**
- Make sure RLS is enabled on each table
- Check policy expressions are correct
- Test policies using the SQL Editor with different user contexts

**Authentication issues:**
- Verify your environment variables are correct
- Check that email confirmation is disabled for testing (Authentication → Settings)

**Type generation fails:**
- Make sure you have the correct project ID
- Check that all tables are created properly

## Next Steps

1. Complete the Supabase client setup in your Next.js app
2. Implement authentication flows
3. Create Server Actions for CRUD operations
4. Build the UI components

## Useful Supabase Dashboard Features

- **SQL Editor**: Write and test queries
- **Table Editor**: Visual table management
- **Authentication → Logs**: Debug auth issues
- **Database → Logs**: See database queries
- **API Docs**: Auto-generated API documentation for your tables