import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Typed Supabase client with your schema
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          phone: string;
          password_hash: string;
          name: string | null;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          password_hash: string;
          name?: string | null;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          password_hash?: string;
          name?: string | null;
          email?: string | null;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          service_type: 'outstation' | 'mumbai-local';
          from_location: string;
          to_location: string;
          car_type: string;
          travel_date: string;
          travel_time: string;
          estimated_price: number;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          customer_name: string;
          customer_phone: string;
          customer_email?: string | null;
          service_type: 'outstation' | 'mumbai-local';
          from_location: string;
          to_location: string;
          car_type: string;
          travel_date: string;
          travel_time: string;
          estimated_price: number;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string | null;
          service_type?: 'outstation' | 'mumbai-local';
          from_location?: string;
          to_location?: string;
          car_type?: string;
          travel_date?: string;
          travel_time?: string;
          estimated_price?: number;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      cities: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      routes: {
        Row: {
          id: string;
          from_city: string;
          to_city: string;
          price_4_seater: number;
          price_6_seater: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          from_city: string;
          to_city: string;
          price_4_seater: number;
          price_6_seater: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          from_city?: string;
          to_city?: string;
          price_4_seater?: number;
          price_6_seater?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      mumbai_pricing: {
        Row: {
          id: string;
          four_seater_rate: number;
          six_seater_rate: number;
          airport_four_seater_rate: number;
          airport_six_seater_rate: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          four_seater_rate: number;
          six_seater_rate: number;
          airport_four_seater_rate: number;
          airport_six_seater_rate: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          four_seater_rate?: number;
          six_seater_rate?: number;
          airport_four_seater_rate?: number;
          airport_six_seater_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      local_fares: {
        Row: {
          id: string;
          service_area: string;
          normal_4_seater_rate_per_km: number;
          normal_6_seater_rate_per_km: number;
          airport_4_seater_rate_per_km: number;
          airport_6_seater_rate_per_km: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_area: string;
          normal_4_seater_rate_per_km: number;
          normal_6_seater_rate_per_km: number;
          airport_4_seater_rate_per_km: number;
          airport_6_seater_rate_per_km: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_area?: string;
          normal_4_seater_rate_per_km?: number;
          normal_6_seater_rate_per_km?: number;
          airport_4_seater_rate_per_km?: number;
          airport_6_seater_rate_per_km?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
