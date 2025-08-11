import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface SupabaseUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface SupabaseAuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  resendConfirmation: (email: string) => Promise<{ error?: string }>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(
  undefined,
);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 Inicializando contexto de autenticação...');
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📱 Sessão inicial:', session?.user?.email || 'Nenhuma');
      setSession(session);
      if (session?.user) {
        const initialUser = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name,
          role: session.user.user_metadata?.role,
        };
        console.log('👤 Usuário da sessão inicial:', initialUser);
        setUser(initialUser);
      }
      console.log('✅ Loading false - inicialização completa');
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email);
      setSession(session);

      if (session?.user) {
        const newUser = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name,
          role: session.user.user_metadata?.role,
        };
        console.log('👤 Usuário autenticado:', newUser);
        setUser(newUser);
      } else {
        console.log('🚪 Usuário deslogado');
        setUser(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: "operator", // Role padrão para novos usuários
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: "Erro inesperado durante o cadastro" };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Tentando fazer login com:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('📊 Resultado do login:', { data, error });

      if (error) {
        console.error('❌ Erro no login:', error.message);

        // Melhorar mensagem de erro para confirmação de email
        if (error.message.includes('email not confirmed') || error.message.includes('Email not confirmed')) {
          return { error: "Você precisa confirmar seu email antes de fazer login. Verifique sua caixa de entrada." };
        }

        return { error: error.message };
      }

      console.log('✅ Login realizado com sucesso:', data.user?.email);
      return {};
    } catch (error) {
      console.error('💥 Erro inesperado no login:', error);
      return { error: "Erro inesperado durante o login" };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: "Erro inesperado ao resetar senha" };
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: "Erro inesperado ao reenviar confirmação" };
    }
  };

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        resendConfirmation,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error(
      "useSupabaseAuth must be used within a SupabaseAuthProvider",
    );
  }
  return context;
}
