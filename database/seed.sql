-- Seed data for development and testing
-- Note: Replace placeholder UUIDs with actual user IDs from your Supabase auth

-- Insert sample users (these would normally be created via Supabase auth)
-- Placeholder: auth.users entries should exist first
INSERT INTO users (id, auth_id, email, full_name) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::UUID, '550e8400-e29b-41d4-a716-446655440001'::UUID, 'demo@aviary.local', 'Demo User')
ON CONFLICT (id) DO NOTHING;

-- Insert sample species
INSERT INTO species (user_id, name, scientific_name, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::UUID, 'Society Finch', 'Lonchura striata domestica', 'Small, colorful finches commonly bred in captivity'),
  ('550e8400-e29b-41d4-a716-446655440001'::UUID, 'Canary', 'Serinus canaria', 'Popular singing bird with bright yellow plumage'),
  ('550e8400-e29b-41d4-a716-446655440001'::UUID, 'Zebra Finch', 'Taeniopygia guttata', 'Australian finch with distinctive striped pattern')
ON CONFLICT DO NOTHING;

-- Insert sample cages
INSERT INTO cages (user_id, name, cage_type, location, dimensions, capacity, notes) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::UUID, 'Flight Cage 1', 'flight', 'Living Room', '10x10x8 ft', 20, 'Main flight cage for society finches'),
  ('550e8400-e29b-41d4-a716-446655440001'::UUID, 'Breeding Box A', 'breeding', 'Utility Room', '2x2x3 ft', 2, 'Dedicated breeding cage'),
  ('550e8400-e29b-41d4-a716-446655440001'::UUID, 'Hospital Cage', 'hospital', 'Office', '3x3x3 ft', 1, 'For quarantine and sick birds')
ON CONFLICT DO NOTHING;

-- Get the species IDs for seeding birds
WITH species_ids AS (
  SELECT id, name FROM species WHERE user_id = '550e8400-e29b-41d4-a716-446655440001'::UUID
)
INSERT INTO birds (user_id, species_id, cage_id, name, leg_ring, sex, date_of_birth, color_mutation, notes) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::UUID, (SELECT id FROM species_ids WHERE name = 'Society Finch'), '550e8400-e29b-41d4-a716-446655440002'::UUID, 'Fred', 'USA-2024-001', 'M', '2024-01-15'::DATE, 'Red and white', 'Friendly male'),
  ('550e8400-e29b-41d4-a716-446655440001'::UUID, (SELECT id FROM species_ids WHERE name = 'Society Finch'), '550e8400-e29b-41d4-a716-446655440002'::UUID, 'Wilma', 'USA-2024-002', 'F', '2024-01-20'::DATE, 'Cream', 'Good breeder'),
  ('550e8400-e29b-41d4-a716-446655440001'::UUID, (SELECT id FROM species_ids WHERE name = 'Canary'), '550e8400-e29b-41d4-a716-446655440002'::UUID, 'Sunny', 'USA-2024-003', 'M', '2023-06-10'::DATE, 'Bright Yellow', 'Excellent singer')
ON CONFLICT (leg_ring) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (user_id, cage_id, title, task_type, due_date, status, priority) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::UUID, '550e8400-e29b-41d4-a716-446655440002'::UUID, 'Clean flight cage', 'cleaning', CURRENT_DATE + INTERVAL '1 day', 'pending', 'high'),
  ('550e8400-e29b-41d4-a716-446655440001'::UUID, '550e8400-e29b-41d4-a716-446655440002'::UUID, 'Refill water feeders', 'feeding', CURRENT_DATE, 'pending', 'high'),
  ('550e8400-e29b-41d4-a716-446655440001'::UUID, '550e8400-e29b-41d4-a716-446655440003'::UUID, 'Check breeding progress', 'breeding', CURRENT_DATE + INTERVAL '3 days', 'pending', 'medium')
ON CONFLICT DO NOTHING;