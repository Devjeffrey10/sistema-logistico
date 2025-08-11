import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../client/lib/supabase";

const supabaseUrl =
  process.env.SUPABASE_URL || "https://yqirewbwerkhpgetzrmg.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL environment variable");
}

if (!supabaseServiceKey) {
  console.warn(
    "Missing SUPABASE_SERVICE_KEY environment variable - using admin operations may fail",
  );
}

// Client for admin operations (uses service key)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

// Client for regular operations (uses anon key)
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
