/*
  # Create local_fares table for Mumbai pricing management

  1. New Tables
    - `local_fares`
      - `id` (uuid, primary key)
      - `service_area` (text) - Service area name (e.g., 'Mumbai Local')
      - `normal_4_seater_rate_per_km` (numeric) - Normal rate per km for 4-seater
      - `normal_6_seater_rate_per_km` (numeric) - Normal rate per km for 6-seater
      - `airport_4_seater_rate_per_km` (numeric) - Airport rate per km for 4-seater
      - `airport_6_seater_rate_per_km` (numeric) - Airport rate per km for 6-seater
      - `created_at` (timestamp) - Creation timestamp
      - `updated_at` (timestamp) - Last update timestamp

  2. Security
    - Enable RLS on `local_fares` table
    - Add policy for public read access
    - Add policy for authenticated admin operations

  3. Initial Data
    - Insert Mumbai Local pricing
*/

CREATE TABLE IF NOT EXISTS local_fares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_area text UNIQUE NOT NULL,
  normal_4_seater_rate_per_km numeric NOT NULL DEFAULT 15,
  normal_6_seater_rate_per_km numeric NOT NULL DEFAULT 18,
  airport_4_seater_rate_per_km numeric NOT NULL DEFAULT 18,
  airport_6_seater_rate_per_km numeric NOT NULL DEFAULT 22,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE local_fares ENABLE ROW LEVEL SECURITY;

-- Allow public read access for pricing display
CREATE POLICY "Local fares are viewable by everyone"
  ON local_fares
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage pricing
CREATE POLICY "Local fares can be managed by authenticated users"
  ON local_fares
  FOR ALL
  TO authenticated
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_local_fares_service_area ON local_fares(service_area);

-- Trigger for updated_at
CREATE TRIGGER update_local_fares_updated_at
  BEFORE UPDATE ON local_fares
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert Mumbai Local pricing
INSERT INTO local_fares (
  service_area,
  normal_4_seater_rate_per_km,
  normal_6_seater_rate_per_km,
  airport_4_seater_rate_per_km,
  airport_6_seater_rate_per_km
) VALUES (
  'Mumbai Local',
  15,
  18,
  18,
  22
) ON CONFLICT (service_area) DO NOTHING;