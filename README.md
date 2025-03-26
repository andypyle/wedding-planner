# Wedding Planner App with Next.js and Supabase

A modern wedding planning application built with Next.js 14, React Server Components, Server Actions, and Supabase for the backend.

## Features

- 💍 Vendor management with payment tracking
- 👨‍👩‍👧‍👦 Guest list management
- 📅 Wedding timeline
- ✅ Planning checklist
- 💰 Budget tracking
- 🔐 User authentication with Supabase
- 🚀 Server Components and Actions for optimal performance

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Authentication**: Supabase Auth with email/password and social providers
- **Styling**: Tailwind CSS with custom earth-tone theme
- **Deployment**: Vercel (frontend) and Supabase (backend)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account

### Setting up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL script in `supabase/schema.sql` to set up your database schema

### Environment Setup

1. Clone the repository
2. Copy `.env.local.example` to `.env.local`
3. Fill in your Supabase credentials from your Supabase project settings:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Run the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── app/                # App router pages and layouts
│   │   ├── actions/        # Server actions
│   │   ├── api/            # API routes
│   │   ├── auth/           # Auth-related routes
│   │   ├── vendors/        # Vendor management pages
│   │   ├── guests/         # Guest management pages
│   │   └── profile/        # User profile pages
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and libraries
│   │   └── supabase/       # Supabase clients
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions
├── supabase/               # Supabase-related files
│   └── schema.sql          # Database schema
└── tailwind.config.ts      # Tailwind CSS configuration
```

## Development

### Adding New Features

When adding new features:

1. Create appropriate database tables in Supabase
2. Create types in `src/types/`
3. Create server actions in `src/app/actions/`
4. Create UI components in `src/components/`
5. Create pages in `src/app/`

### Authentication Flow

The app uses Supabase Authentication with:

- Email/Password login
- Google OAuth
- Facebook OAuth

User session is maintained using Supabase's cookie-based auth with Next.js middleware.

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Add environment variables for Supabase
4. Deploy!

### Updating Supabase Schema

When updating your database schema:

1. Update the `supabase/schema.sql` file
2. Run the new migrations in your Supabase SQL Editor
3. Update the corresponding TypeScript types

## License

This project is MIT licensed.
