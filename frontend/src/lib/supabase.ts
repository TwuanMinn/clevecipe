// Lib - Supabase client configuration

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create a mock client that doesn't throw errors when Supabase is not configured
let supabaseInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

// Export a proxy that handles missing Supabase configuration gracefully
export const supabase = supabaseInstance || {
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: null }),
        signInWithOAuth: async () => ({ data: { url: null, provider: null }, error: new Error('Supabase not configured') }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    },
    from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        upsert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
        insert: async () => ({ data: null, error: null }),
        update: () => ({ eq: async () => ({ data: null, error: null }) }),
        delete: () => ({ eq: async () => ({ data: null, error: null }) }),
    }),
} as unknown as SupabaseClient;
