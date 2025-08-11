interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Este componente agora só renderiza os children
  // A autenticação é gerenciada pelo AppRoutes no App.tsx
  return <>{children}</>;
}
