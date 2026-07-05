import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export interface SignUpFields {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

interface AuthResult {
  error: string | null;
  /** True when signUp succeeded but requires email confirmation before a session exists. */
  needsEmailConfirmation?: boolean;
}

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  signUp: (fields: SignUpFields) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function signUp(fields: SignUpFields): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: fields.email,
        password: fields.password,
      });
      if (error) return { error: error.message };

      if (!data.session) {
        return { error: null, needsEmailConfirmation: true };
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user!.id,
        first_name: fields.firstName,
        last_name: fields.lastName,
        phone: fields.phone || null,
        address: fields.address || null,
      });
      if (profileError) return { error: profileError.message };

      return { error: null };
    } catch {
      return { error: 'Could not reach the server. Check your connection and try again.' };
    }
  }

  async function signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? error.message : null };
    } catch {
      return { error: 'Could not reach the server. Check your connection and try again.' };
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ session, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
