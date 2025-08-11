import { useState } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Loader2,
  Truck,
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  UserPlus,
} from "lucide-react";

export default function SupabaseLogin() {
  const { signIn, signUp, resetPassword, resendConfirmation, loading } = useSupabaseAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  // Signup form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  // Reset password state
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setShowResendConfirmation(false);
    setResendSuccess("");

    if (!loginEmail || !loginPassword) {
      setLoginError("Por favor, preencha todos os campos");
      return;
    }

    const { error } = await signIn(loginEmail, loginPassword);
    if (error) {
      setLoginError(error);
      // Mostrar botão de reenvio se for erro de confirmação
      if (error.includes("confirmar seu email")) {
        setShowResendConfirmation(true);
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");

    if (!signupEmail || !signupPassword || !confirmPassword) {
      setSignupError("Por favor, preencha todos os campos");
      return;
    }

    if (signupPassword !== confirmPassword) {
      setSignupError("As senhas não coincidem");
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    const { error } = await signUp(signupEmail, signupPassword);
    if (error) {
      setSignupError(error);
    } else {
      setSignupSuccess(
        "Cadastro realizado! Verifique seu email para confirmar a conta.",
      );
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (!resetEmail) {
      setResetError("Por favor, informe seu email");
      return;
    }

    const { error } = await resetPassword(resetEmail);
    if (error) {
      setResetError(error);
    } else {
      setResetSuccess(
        "Email de recuperação enviado! Verifique sua caixa de entrada.",
      );
      setResetEmail("");
    }
  };

  const handleResendConfirmation = async () => {
    setResendSuccess("");
    const { error } = await resendConfirmation(loginEmail);
    if (error) {
      setLoginError(error);
    } else {
      setResendSuccess("Email de confirmação reenviado! Verifique sua caixa de entrada.");
      setShowResendConfirmation(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Theme Toggle */}
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary shadow-lg">
              <Truck className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              TransporteManager
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sistema de Gestão de Transportadora
            </p>
          </div>
        </div>

        {/* Auth Forms */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Acesso ao Sistema
            </CardTitle>
            <CardDescription className="text-center">
              Faça login ou crie uma nova conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Cadastro</TabsTrigger>
                <TabsTrigger value="reset">Recuperar</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu-email@empresa.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 pr-10"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        disabled={loading}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {loginError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}

                  {showResendConfirmation && (
                    <Alert>
                      <Mail className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <span>Precisa confirmar o email?</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResendConfirmation}
                            disabled={loading}
                          >
                            Reenviar
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {resendSuccess && (
                    <Alert>
                      <Mail className="h-4 w-4" />
                      <AlertDescription>{resendSuccess}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu-email@empresa.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="pl-10 pr-10"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                        onClick={() =>
                          setShowSignupPassword(!showSignupPassword)
                        }
                        disabled={loading}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {signupError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{signupError}</AlertDescription>
                    </Alert>
                  )}

                  {signupSuccess && (
                    <Alert>
                      <UserPlus className="h-4 w-4" />
                      <AlertDescription>{signupSuccess}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Criar Conta
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Reset Password Tab */}
              <TabsContent value="reset" className="space-y-4">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="seu-email@empresa.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {resetError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{resetError}</AlertDescription>
                    </Alert>
                  )}

                  {resetSuccess && (
                    <Alert>
                      <Mail className="h-4 w-4" />
                      <AlertDescription>{resetSuccess}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar Email de Recuperação
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2025 Sistema dev to NexcodePE. Todos os direitos reservados.</p>
          <p className="mt-2">
            Configurado com{" "}
            <span className="font-semibold text-primary">Supabase Auth</span> e{" "}
            <span className="font-semibold text-primary">Netlify</span>
          </p>
        </div>
      </div>
    </div>
  );
}
