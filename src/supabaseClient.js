import { createClient } from "@supabase/supabase-js";

// 1. Grab your environment variables securely using Vite's syntax
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// 2. Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
