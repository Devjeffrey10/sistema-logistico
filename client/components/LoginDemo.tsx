import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginDemo() {
  const { login } = useAuth();

  const handleDemoLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  return (
   
          className="w-full"
          onClick={() =>
            handleDemoLogin("admin@transportadora.com", "admin123")
          }
        >
          Login como Administrador
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleDemoLogin("joao@transportadora.com", "joao123")}
        >
        
          }
        >
          Login como Visualizador
        </Button>
      </CardContent>
    </Card>
  );
}
