import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// On initialise le client avec le type Database (qui est "any" maintenant)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);