import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://yqirewbwerkhpgetzrmg.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl) {
  throw new Error("Missing VITE_SUPABASE_URL environment variable");
}

if (!supabaseAnonKey) {
  console.warn("Missing VITE_SUPABASE_ANON_KEY environment variable");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Types for our database tables
export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          email: string;
          nome: string;
          função: string;
          telefone?: string;
          status: "active" | "inactive";
          created_at: string;
          last_login?: string;
        };
        Insert: {
          id?: string;
          email: string;
          nome: string;
          função: string;
          telefone?: string;
          status?: "active" | "inactive";
          created_at?: string;
          last_login?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nome?: string;
          função?: string;
          telefone?: string;
          status?: "active" | "inactive";
          created_at?: string;
          last_login?: string;
        };
      };
    };
  };
}
