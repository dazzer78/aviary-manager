-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- Users table (linked to Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Species table
CREATE TABLE IF NOT EXISTS species (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Cages/Aviaries table
CREATE TABLE IF NOT EXISTS cages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  cage_type VARCHAR(50), -- e.g., 'flight', 'breeding', 'hospital'
  location VARCHAR(255),
  dimensions VARCHAR(100), -- e.g., '10x10x8 ft'
  capacity INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Birds table
CREATE TABLE IF NOT EXISTS birds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  species_id UUID NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  cage_id UUID REFERENCES cages (id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  leg_ring VARCHAR(50) UNIQUE,
  sex CHAR(1), -- 'M', 'F', 'U' (unknown)
  date_of_birth DATE,
  date_acquired DATE,
  color_mutation VARCHAR(100),
  notes TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Breeding pairs table
CREATE TABLE IF NOT EXISTS breeding_pairs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  cage_id UUID NOT NULL REFERENCES cages (id) ON DELETE CASCADE,
  male_bird_id UUID NOT NULL REFERENCES birds (id) ON DELETE CASCADE,
  female_bird_id UUID NOT NULL REFERENCES birds (id) ON DELETE CASCADE,
  pairing_date DATE,
  notes TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Clutches table
CREATE TABLE IF NOT EXISTS clutches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  breeding_pair_id UUID NOT NULL REFERENCES breeding_pairs (id) ON DELETE CASCADE,
  clutch_number INT,
  laid_date DATE,
  expected_hatch_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Eggs table
CREATE TABLE IF NOT EXISTS eggs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  clutch_id UUID NOT NULL REFERENCES clutches (id) ON DELETE CASCADE,
  egg_number INT,
  laid_date DATE,
  status VARCHAR(50), -- e.g., 'laying', 'incubating', 'hatched', 'infertile', 'abandoned'
  hatch_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Chicks table
CREATE TABLE IF NOT EXISTS chicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  egg_id UUID REFERENCES eggs (id) ON DELETE SET NULL,
  hatch_date DATE,
  fledge_date DATE,
  sex CHAR(1), -- 'M', 'F', 'U' (unknown)
  color_mutation VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Health records table
CREATE TABLE IF NOT EXISTS health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  bird_id UUID NOT NULL REFERENCES birds (id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  record_type VARCHAR(50), -- e.g., 'checkup', 'medication', 'illness', 'treatment'
  title VARCHAR(255),
  description TEXT,
  medication_name VARCHAR(255),
  dosage VARCHAR(100),
  duration_days INT,
  vet_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tasks/Reminders table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  cage_id UUID REFERENCES cages (id) ON DELETE CASCADE,
  bird_id UUID REFERENCES birds (id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  task_type VARCHAR(50), -- e.g., 'feeding', 'cleaning', 'medication', 'breeding', 'health_check'
  due_date DATE,
  due_time TIME,
  status VARCHAR(50), -- e.g., 'pending', 'completed', 'overdue'
  priority VARCHAR(20), -- e.g., 'low', 'medium', 'high'
  completed_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Bird photos table
CREATE TABLE IF NOT EXISTS bird_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  bird_id UUID NOT NULL REFERENCES birds (id) ON DELETE CASCADE,
  storage_path VARCHAR(500) NOT NULL, -- path in Supabase storage
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_species_user_id ON species(user_id);
CREATE INDEX idx_cages_user_id ON cages(user_id);
CREATE INDEX idx_birds_user_id ON birds(user_id);
CREATE INDEX idx_birds_species_id ON birds(species_id);
CREATE INDEX idx_birds_cage_id ON birds(cage_id);
CREATE INDEX idx_breeding_pairs_user_id ON breeding_pairs(user_id);
CREATE INDEX idx_breeding_pairs_cage_id ON breeding_pairs(cage_id);
CREATE INDEX idx_clutches_user_id ON clutches(user_id);
CREATE INDEX idx_clutches_breeding_pair_id ON clutches(breeding_pair_id);
CREATE INDEX idx_eggs_user_id ON eggs(user_id);
CREATE INDEX idx_eggs_clutch_id ON eggs(clutch_id);
CREATE INDEX idx_chicks_user_id ON chicks(user_id);
CREATE INDEX idx_health_records_user_id ON health_records(user_id);
CREATE INDEX idx_health_records_bird_id ON health_records(bird_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_bird_photos_user_id ON bird_photos(user_id);
CREATE INDEX idx_bird_photos_bird_id ON bird_photos(bird_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE species ENABLE ROW LEVEL SECURITY;
ALTER TABLE cages ENABLE ROW LEVEL SECURITY;
ALTER TABLE birds ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeding_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clutches ENABLE ROW LEVEL SECURITY;
ALTER TABLE eggs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bird_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only see their own data)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can view own species" ON species
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own species" ON species
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own species" ON species
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own species" ON species
  FOR DELETE USING (user_id = auth.uid());

-- Similar policies for other tables (abbreviated for cages)
CREATE POLICY "Users can view own cages" ON cages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own cages" ON cages
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own cages" ON cages
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own cages" ON cages
  FOR DELETE USING (user_id = auth.uid());

-- Apply similar pattern to all other tables...
CREATE POLICY "Users can view own birds" ON birds
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own birds" ON birds
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own birds" ON birds
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own birds" ON birds
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own breeding_pairs" ON breeding_pairs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own breeding_pairs" ON breeding_pairs
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own breeding_pairs" ON breeding_pairs
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own breeding_pairs" ON breeding_pairs
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own clutches" ON clutches
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own clutches" ON clutches
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own clutches" ON clutches
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own clutches" ON clutches
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own eggs" ON eggs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own eggs" ON eggs
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own eggs" ON eggs
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own eggs" ON eggs
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own chicks" ON chicks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own chicks" ON chicks
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own chicks" ON chicks
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own chicks" ON chicks
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own health_records" ON health_records
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own health_records" ON health_records
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own health_records" ON health_records
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own health_records" ON health_records
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own bird_photos" ON bird_photos
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own bird_photos" ON bird_photos
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bird_photos" ON bird_photos
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own bird_photos" ON bird_photos
  FOR DELETE USING (user_id = auth.uid());