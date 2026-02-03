'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

type UserRole = 'admin' | 'employee' | 'manager';

interface AuthUser extends User {
  role?: UserRole;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  console.log('AuthProvider rendering, user:', user, 'loading:', loading);

  useEffect(() => {
    // Create client inside useEffect to ensure we're in browser context
    console.log('useEffect starting...');
    const supabase = createClient();
    console.log('Supabase client created');
    
    const initializeAuth = async () => {
      try {
        console.log('Fetching session...');
        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession();
        
        console.log('Session result:', session, 'Error:', sessionError);
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          console.log('User found, fetching profile...');
          const { data: userData, error: profileError } = await supabase
            .from('users')
            .select('role, first_name, last_name')
            .eq('id', session.user.id)
            .single();

          console.log('Profile data:', userData, 'Error:', profileError);

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            setUser({ ...session.user, role: 'employee' } as AuthUser);
          } else {
            setUser({ ...session.user, ...userData });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: userData, error: profileError } = await supabase
          .from('users')
          .select('role, first_name, last_name')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          // Set user without profile data
          setUser(session.user as AuthUser);
        } else {
          setUser({ ...session.user, ...userData });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signIn = async (email: string, password: string) => {
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Insert user profile
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          role: userData.role || 'employee',
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          address: userData.address,
        });

        if (profileError) throw profileError;
      }

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const resetPassword = async (email: string) => {
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
