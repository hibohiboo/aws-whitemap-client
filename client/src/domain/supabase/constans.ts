if (!import.meta.env.VITE_PUBLIC_SUPABASE_URL || typeof import.meta.env.VITE_PUBLIC_SUPABASE_URL !== 'string') throw new Error('VITE_PUBLIC_SUPABASE_URL is empty');
if (!import.meta.env.VITE_PUBLIC_SUPABASE_ANON_API_KEY || typeof import.meta.env.VITE_PUBLIC_SUPABASE_ANON_API_KEY !== 'string') throw new Error('VITE_PUBLIC_SUPABASE_ANON_API_KEY is empty');
export const supabaseApiKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_API_KEY;
export const supabaseApiURL = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
