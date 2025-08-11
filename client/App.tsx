import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Loader2 } from "lucide-react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import {
  SupabaseAuthProvider,
  useSupabaseAuth,
} from "./contexts/SupabaseAuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { VehicleProvider } from "./contexts/VehicleContext";
import { ProductProvider } from "./contexts/ProductContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import FuelManagement from "./pages/FuelManagement";
import ProductEntry from "./pages/ProductEntry";
import SupplierManagement from "./pages/SupplierManagement";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import VehicleManagement from "./pages/VehicleManagement";
import NotFound from "./pages/NotFound";
import SupabaseLogin from "./pages/SupabaseLogin";

const queryClient = new QueryClient();

// Componente interno para gerenciar o roteamento baseado na autenticação
const AppRoutes = () => {
  const { user, loading } = useSupabaseAuth();

  console.log('🚀 AppRoutes - Estado atual:', { user: user?.email, loading });

  if (loading) {
    console.log('⏳ Mostrando loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🔐 Usuário não autenticado, mostrando login');
    return <SupabaseLogin />;
  }

  console.log('✅ Usuário autenticado, mostrando dashboard');

  return (
    <AuthProvider>
      <VehicleProvider>
        <ProductProvider>
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/combustivel" element={<FuelManagement />} />
                <Route path="/produtos" element={<ProductEntry />} />
                <Route path="/fornecedores" element={<SupplierManagement />} />
                <Route path="/relatorios" element={<Reports />} />
                <Route path="/usuarios" element={<Users />} />
                <Route path="/frota" element={<VehicleManagement />} />
                <Route path="/configuracoes" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        </ProductProvider>
      </VehicleProvider>
    </AuthProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </SupabaseAuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

// Handle hot module reloading properly
const rootElement = document.getElementById("root")!;

// Check if we already have a React root instance
if (!(rootElement as any)._reactRoot) {
  const root = createRoot(rootElement);
  (rootElement as any)._reactRoot = root;
  root.render(<App />);
} else {
  // Reuse existing root for hot reloading
  (rootElement as any)._reactRoot.render(<App />);
}
