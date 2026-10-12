import { createClient } from '@supabase/supabase-js';

import { SUPABASE_URL as url, SUPABASE_ANON_KEY as key } from '../config.js';
export const configured = Boolean(url && key);
export const supabase = configured ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } }) : null;
