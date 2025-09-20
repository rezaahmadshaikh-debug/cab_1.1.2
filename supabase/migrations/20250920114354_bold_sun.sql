/*
  # Create mumbai_pricing table for centralized pricing management

  1. New Tables
    - `mumbai_pricing`
      - `id` (text, primary key) - Fixed ID "default" for single row
      - `four_seater_rate` (numeric) - Rate per km for 4-seater vehicles
      - `six_seater_rate` (numeric) - Rate per km for 6-seater vehicles
      - `airport_four_seater_rate` (numeric) - Airport rate per km for 4-seater
      - `airport_six_seater_rate` (numeric) - Airport rate per km for 6-seater
      - `created_at` (timestamp) - Creation timestamp
      - `updated_at` (timestamp) - Last update timestamp

  2. Security
    - Enable RLS on `mumbai_pricing` table
    - Add policy for public read access (for pricing display)
    - Add policy for authenticated admin operations

  3. Initial Data
    - Insert default pricing values
*/

CREATE TABLE IF NOT EXISTS mumbai_pricing (
  id text PRIMARY KEY DEFAULT 'default',
  four_seater_rate numeric NOT NULL DEFAULT 15,
  six_seater_rate numeric NOT NULL DEFAULT 18,
  airport_four_seater_rate numeric NOT NULL DEFAULT 18,
  airport_six_seater_rate numeric NOT NULL DEFAULT 22,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE mumbai_pricing ENABLE ROW LEVEL SECURITY;

-- Allow public read access for pricing display
CREATE POLICY "Mumbai pricing is viewable by everyone"
  ON mumbai_pricing
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage pricing
CREATE POLICY "Mumbai pricing can be managed by authenticated users"
  ON mumbai_pricing
  FOR ALL
  TO authenticated
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_mumbai_pricing_updated_at
  BEFORE UPDATE ON mumbai_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default pricing
INSERT INTO mumbai_pricing (
  id,
  four_seater_rate,
  six_seater_rate,
  airport_four_seater_rate,
  airport_six_seater_rate
) VALUES (
  'default',
  15,
  18,
  18,
  22
) ON CONFLICT (id) DO NOTHING;