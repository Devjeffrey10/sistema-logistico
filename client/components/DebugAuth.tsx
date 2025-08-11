import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugAuth() {
  const { user, session, loading } = useSupabaseAuth();
  const [testResult, setTestResult] = useState<string>("");

  const testConnection = async () => {
    try {
      setTestResult("Testando conexão...");
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setTestResult(`Erro na conexão: ${error.message}`);
      } else {
        setTestResult(`Conexão OK! Session: ${data.session ? 'Ativa' : 'Nenhuma'}`);
      }
    } catch (err) {
      setTestResult(`Erro inesperado: ${err}`);
    }
  };

  const testLogin = async () => {
    try {
      setTestResult("Testando login...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "test@test.com",
        password: "123456"
      });

      if (error) {
        setTestResult(`Erro no login: ${error.message}`);
      } else {
        setTestResult(`Login OK! User: ${data.user?.email}`);
      }
    } catch (err) {
      setTestResult(`Erro inesperado no login: ${err}`);
    }
  };

  const checkSupabaseConfig = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    setTestResult(`URL: ${url}\nKey: ${key ? 'Configurada' : 'Não configurada'}`);
  };

  return (
    <Card className="fixed top-4 right-4 w-96 z-50 bg-white border-2 border-red-500">
      <CardHeader>
        <CardTitle>Debug Auth</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p><strong>Loading:</strong> {loading ? "Sim" : "Não"}</p>
          <p><strong>User:</strong> {user ? user.email : "Nenhum"}</p>
          <p><strong>Session:</strong> {session ? "Ativa" : "Nenhuma"}</p>
        </div>
        
        <div className="space-y-2">
          <Button onClick={testConnection} size="sm" className="w-full">
            Testar Conexão
          </Button>
          <Button onClick={testLogin} size="sm" className="w-full">
            Testar Login
          </Button>
        </div>
        
        {testResult && (
          <div className="text-sm p-2 bg-gray-100 rounded">
            {testResult}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
