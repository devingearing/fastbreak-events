# Fastbreak Events - Sports Event Management

A full-stack sports event management application built with Next.js 15, TypeScript, Supabase, and Tailwind CSS.

## Features

- 🔐 **Authentication**: Email/password authentication with Supabase Auth (Google OAuth ready)
- 📅 **Event Management**: Create, view, edit, and delete sports events
- 🏟️ **Venue Management**: Associate multiple venues with each event
- 🔍 **Search & Filter**: Search events by name and filter by sport type
- 📱 **Responsive Design**: Mobile-friendly UI with shadcn/ui components
- 🛡️ **Type Safety**: Full TypeScript support with generated database types
- 🚀 **Server Actions**: All database operations through secure server-side actions
- ⚡ **Performance**: Optimistic UI updates and efficient data fetching

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fastbreak-events
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

4. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Database Setup

1. Go to your Supabase project's SQL editor
2. Run the SQL script from `supabase/schema.sql`
3. This will create:
   - `events` table with RLS policies
   - `venues` table with sample data
   - `event_venues` junction table
   - Necessary indexes and triggers

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
fastbreak-events/
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── actions/           # Server actions
│   └── auth/              # Auth callback route
├── components/            # React components
│   ├── events/           # Event-specific components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities
│   ├── actions/          # Action wrappers
│   └── supabase/         # Supabase clients
├── types/                # TypeScript types
└── supabase/             # Database schema
```

## Key Architecture Decisions

1. **Server-First Approach**: All database operations happen through Server Actions
2. **Type Safety**: Zod schemas for validation, generated Supabase types
3. **Error Handling**: Consistent error handling with action wrapper
4. **Auth Middleware**: Route protection at middleware level
5. **Optimistic Updates**: Better UX with immediate UI feedback

## Authentication Flow

1. Users can sign up/login with email and password
2. Protected routes redirect to login if not authenticated
3. Auth state is managed by Supabase and persisted in cookies
4. Google OAuth is preconfigured but requires Google Cloud setup

## Database Schema

### Events Table
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to auth.users)
- `name` (varchar)
- `sport_type` (varchar)
- `event_date` (timestamp)
- `description` (text, optional)
- `created_at`, `updated_at` (timestamps)

### Venues Table
- `id` (UUID, primary key)
- `name`, `address`, `city`, `country` (required)
- `state`, `postal_code` (optional)
- `created_at`, `updated_at` (timestamps)

### Event_Venues Table
- `event_id`, `venue_id` (composite primary key)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
4. Deploy!

### Post-Deployment

1. Update Supabase Auth redirect URLs
2. Configure Google OAuth (if using)
3. Test auth flows in production

## Security Considerations

- Row Level Security (RLS) enabled on all tables
- Users can only CRUD their own events
- Service role key never exposed to client
- All forms validated with Zod
- CSRF protection built into Next.js

## Future Enhancements

- [ ] Google OAuth integration
- [ ] Event attendee management
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Event categories/tags
- [ ] Advanced filtering options
- [ ] Data export functionality
- [ ] Multi-tenant support

## Testing

The application includes:
- Type checking: `npm run type-check`
- Linting: `npm run lint`
- Build verification: `npm run build`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.