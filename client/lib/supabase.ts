import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yqirewbwerkhpgetzrmg.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on your database schema
export interface Driver {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  cnh: string;
  cnh_category: "D" | "E";
  cnh_expiry: string;
  status: "active" | "inactive";
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: string;
  capacity?: string;
  fuel_type: "diesel" | "gasoline" | "ethanol";
  status: "active" | "inactive" | "maintenance";
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}
