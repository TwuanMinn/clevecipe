'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface UserProfile {
    id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
    dietary_preferences: string[];
    allergies: string[];
    health_goals: string[];
    daily_calorie_target: number;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from database
    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                return null;
            }
            return data as UserProfile;
        } catch (err) {
            console.error('Profile fetch error:', err);
            return null;
        }
    }, []);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            // Skip if Supabase is not configured
            if (!isSupabaseConfigured) {
                console.warn('Supabase not configured - running in demo mode');
                setLoading(false);
                return;
            }

            try {
                // Get current session
                const { data: { session: currentSession } } = await supabase.auth.getSession();

                if (currentSession) {
                    setSession(currentSession);
                    setUser(currentSession.user);

                    // Fetch profile
                    const userProfile = await fetchProfile(currentSession.user.id);
                    setProfile(userProfile);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Listen for auth changes (only if Supabase is configured)
        if (!isSupabaseConfigured) {
            return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, newSession: Session | null) => {
                setSession(newSession);
                setUser(newSession?.user ?? null);

                if (newSession?.user) {
                    const userProfile = await fetchProfile(newSession.user.id);
                    setProfile(userProfile);
                } else {
                    setProfile(null);
                }

                if (event === 'SIGNED_OUT') {
                    setProfile(null);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchProfile]);

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            return { error: error ? new Error(error.message) : null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const signUp = async (email: string, password: string, name?: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name || email.split('@')[0],
                    },
                },
            });

            if (error) {
                return { error: new Error(error.message) };
            }

            // Create initial profile (will be handled by Supabase trigger, but backup here)
            if (data.user) {
                await supabase.from('profiles').upsert({
                    id: data.user.id,
                    email: email,
                    name: name || email.split('@')[0],
                    dietary_preferences: [],
                    allergies: [],
                    health_goals: [],
                    daily_calorie_target: 2000,
                });
            }

            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
    };

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`,
                },
            });
            return { error: error ? new Error(error.message) : null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!user) return { error: new Error('Not authenticated') };

        try {
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (!error) {
                setProfile(prev => prev ? { ...prev, ...updates } : null);
            }

            return { error: error ? new Error(error.message) : null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    const refreshProfile = async () => {
        if (user) {
            const userProfile = await fetchProfile(user.id);
            setProfile(userProfile);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            session,
            loading,
            signIn,
            signUp,
            signOut,
            signInWithGoogle,
            updateProfile,
            refreshProfile,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
