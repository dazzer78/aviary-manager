# Aviary Manager - Setup Guide

## Project Overview

**Aviary Manager** is a comprehensive web application for managing aviary operations, built with Next.js, Tabler UI, Supabase, and Vercel.

### Core Features

The application is organized into **9 main modules**:

1. **Dashboard** - Overview of key metrics and pending tasks
2. **Birds** - Manage individual birds (name, species, ring numbers, genetics)
3. **Species** - Catalog of bird species in your collection
4. **Cages/Aviaries** - Manage cage inventory and assignments
5. **Breeding Pairs** - Track active breeding pairs and pairings
6. **Clutches & Eggs** - Monitor egg laying, incubation, and hatch records
7. **Health Records** - Track checkups, medications, and illnesses
8. **Tasks & Reminders** - Daily feeding, cleaning, and breeding task management
9. **Photos** - Gallery of bird photos with organization by species/bird

---

## Database Schema

The application uses a PostgreSQL database with the following tables:

### Core Tables

- **users** - User accounts linked to Supabase Auth
- **species** - Bird species catalog
- **cages** - Aviary/cage inventory
- **birds** - Individual bird records
- **breeding_pairs** - Active breeding pairs
- **clutches** - Egg clutches from breeding pairs
- **eggs** - Individual egg records with hatch tracking
- **chicks** - Hatch records and young bird tracking

### Supporting Tables

- **health_records** - Medications, checkups, and health notes
- **tasks** - Reminders for feeding, cleaning, health checks, breeding tasks
- **bird_photos** - Photo gallery with Supabase Storage integration

### Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- All relationships enforce user isolation

---

## File Structure

```
src/
├── app/
│   ├── (app)/
│   │   ├── layout.tsx              # App layout with sidebar & topbar
│   │   └── dashboard/
│   │       ├── page.tsx            # Dashboard overview
│   │       ├── birds/page.tsx      # Birds module
│   │       ├── species/page.tsx    # Species module
│   │       ├── cages/page.tsx      # Cages module
│   │       ├── breeding/page.tsx   # Breeding pairs module
│   │       ├── clutches/page.tsx   # Clutches & eggs module
│   │       ├── health/page.tsx     # Health records module
│   │       ├── tasks/page.tsx      # Tasks module
│   │       └── photos/page.tsx     # Photos module
│   ├── login/
│   │   └── page.tsx                # Login page
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home page
├── components/
│   ├── Sidebar.tsx                 # Navigation sidebar
│   ├── Topbar.tsx                  # Top navigation bar
│   └── Navigation.tsx              # Navigation utilities
├── lib/
│   ├── types.ts                    # TypeScript types for all models
│   ├── supabase/
│   │   ├── client.ts               # Client-side Supabase
│   │   ├── server.ts               # Server-side Supabase
│   │   └── queries.ts              # Example query functions
└── database/
    ├── schema.sql                  # Database schema with RLS policies
    └── seed.sql                    # Sample data for testing
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Environment variables set up

### Environment Setup

1. Copy `.env.example` to `.env.local` (if it exists, or create):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

2. Set up Supabase database:
   - Create a new PostgreSQL database in Supabase
   - Run the SQL from `database/schema.sql` in the SQL editor
   - Run the SQL from `database/seed.sql` for sample data

3. Enable authentication in Supabase:
   - Configure Email/Password provider
   - Set up password reset email templates

### Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to access the application.

---

## Next Steps

### Immediate Todo

- [ ] Implement authentication UI components (sign up, password reset)
- [ ] Create CRUD operations for each module
- [ ] Add form components for data entry
- [ ] Implement data fetching with proper error handling
- [ ] Add image upload functionality for bird photos
- [ ] Mobile-responsive refinements

### Phase 2: Advanced Features

- [ ] Breeding records with genetics tracking
- [ ] Health history charts
- [ ] Task notifications and reminders
- [ ] Export functionality (PDF reports, CSV)
- [ ] Search and filtering across all modules
- [ ] Dark mode support

### Phase 3: Mobile App

- [ ] Expo React Native mobile app
- [ ] Share Supabase backend with web app
- [ ] Offline-first synchronization
- [ ] Photo capture and upload

---

## Database Operations Reference

### Example Queries

```typescript
// Get all birds for a user
const { data: birds } = await supabase
  .from('birds')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

// Get active breeding pairs with bird details
const { data: pairs } = await supabase
  .from('breeding_pairs')
  .select('*, birds!inner(*)')
  .eq('active', true);

// Get pending tasks
const { data: tasks } = await supabase
  .from('tasks')
  .select('*')
  .in('status', ['pending', 'overdue'])
  .order('due_date', { ascending: true });
```

See `src/lib/supabase/queries.ts` for more examples.

---

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Create a new project in Vercel
3. Import your GitHub repository
4. Set environment variables in Vercel dashboard
5. Deploy!

### Environment Variables for Production

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

---

## Support & Contributing

For questions or issues, check the Supabase and Tabler documentation:
- [Supabase Docs](https://supabase.com/docs)
- [Tabler Docs](https://tabler.io/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**Happy birding! 🐦**
