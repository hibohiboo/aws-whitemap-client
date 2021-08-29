import { createClient } from '@supabase/supabase-js';
import { supabaseApiKey, supabaseApiURL } from './constans';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseApiURL, supabaseApiKey);
