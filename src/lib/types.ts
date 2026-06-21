// Database types for Aviary Manager

export type User = {
  id: string;
  auth_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
};

export type Species = {
  id: string;
  user_id: string;
  name: string;
  scientific_name: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Cage = {
  id: string;
  user_id: string;
  name: string;
  cage_type: 'flight' | 'breeding' | 'hospital' | string;
  location: string | null;
  dimensions: string | null;
  capacity: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Bird = {
  id: string;
  user_id: string;
  species_id: string;
  cage_id: string | null;
  name: string;
  leg_ring: string | null;
  sex: 'M' | 'F' | 'U' | null;
  date_of_birth: string | null;
  date_acquired: string | null;
  color_mutation: string | null;
  notes: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type BreedingPair = {
  id: string;
  user_id: string;
  cage_id: string;
  male_bird_id: string;
  female_bird_id: string;
  pairing_date: string | null;
  notes: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Clutch = {
  id: string;
  user_id: string;
  breeding_pair_id: string;
  clutch_number: number | null;
  laid_date: string | null;
  expected_hatch_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Egg = {
  id: string;
  user_id: string;
  clutch_id: string;
  egg_number: number | null;
  laid_date: string | null;
  status: 'laying' | 'incubating' | 'hatched' | 'infertile' | 'abandoned' | string;
  hatch_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Chick = {
  id: string;
  user_id: string;
  egg_id: string | null;
  hatch_date: string | null;
  fledge_date: string | null;
  sex: 'M' | 'F' | 'U' | null;
  color_mutation: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type HealthRecord = {
  id: string;
  user_id: string;
  bird_id: string;
  record_date: string;
  record_type: 'checkup' | 'medication' | 'illness' | 'treatment' | string;
  title: string | null;
  description: string | null;
  medication_name: string | null;
  dosage: string | null;
  duration_days: number | null;
  vet_name: string | null;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  cage_id: string | null;
  bird_id: string | null;
  title: string;
  description: string | null;
  task_type: 'feeding' | 'cleaning' | 'medication' | 'breeding' | 'health_check' | string;
  due_date: string | null;
  due_time: string | null;
  status: 'pending' | 'completed' | 'overdue' | string;
  priority: 'low' | 'medium' | 'high' | string;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
};

export type BirdPhoto = {
  id: string;
  user_id: string;
  bird_id: string;
  storage_path: string;
  caption: string | null;
  created_at: string;
};
