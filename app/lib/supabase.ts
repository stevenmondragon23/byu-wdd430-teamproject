import { createClient } from '@supabase/supabase-js';
 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseKey =
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
	process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
	process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
	throw new Error('Supabase URL is required. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL.');
}

if (!supabaseKey) {
	throw new Error(
		'Supabase key is required. Set NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, or SUPABASE_ANON_KEY.',
	);
}
 
export const supabase = createClient(supabaseUrl, supabaseKey);
 