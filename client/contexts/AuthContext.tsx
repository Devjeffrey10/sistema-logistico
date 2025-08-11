import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  LoginRequest,
  LoginResponse,
  ApiResponse,
} from "@shared/api";

interface AuthUser extends User {
  password?: string;
}

interface AuthContextType {
  user: Omit<User, "phone" | "status" | "createdAt" | "lastLogin"> | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    userData: CreateUserRequest,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  users: User[];
  addUser: (
    userData: CreateUserRequest,
  ) => Promise<{ success: boolean; error?: string }>;
  updateUser: (id: string, userData: UpdateUserRequest) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  toggleUserStatus: (id: string) => Promise<boolean>;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<
    User,
    "phone" | "status" | "createdAt" | "lastLogin"
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  // Check for stored user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Fetch users when component mounts
  useEffect(() => {
    if (user) {
      refreshUsers();
    }
  }, [user]);

  const refreshUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data: ApiResponse<User[]> = await response.json();
        if (data.success && data.data) {
          setUsers(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const loginData: LoginRequest = { email, password };

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      // Check if response is ok first
      if (!response.ok) {
        console.error("Login failed:", response.status, response.statusText);
        setIsLoading(false);
        return false;
      }

      // Parse response only once
      const data: LoginResponse = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsLoading(false);
        return true;
      } else {
        console.error("Login failed:", data.error);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    userData: CreateUserRequest,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      console.log("🔄 Sending registration request...");

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("📡 Response status:", response.status, response.statusText);

      // Clone the response before reading to avoid "body stream already read" error
      const responseClone = response.clone();

      // Try to parse the response
      let data: LoginResponse;
      try {
        // Check if response has content-type application/json
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Response is not JSON:", contentType);
          setIsLoading(false);
          return {
            success: false,
            error: `Erro do servidor (${response.status}): Resposta não é JSON`
          };
        }

        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);

        // Try to get response text for debugging
        try {
          const responseText = await responseClone.text();
          console.error("Response text:", responseText);
        } catch (textError) {
          console.error("Could not read response text:", textError);
        }

        setIsLoading(false);
        return {
          success: false,
          error: `Erro do servidor (${response.status}): Resposta inválida`
        };
      }

      if (response.ok && data.success) {
        console.log("✅ Registration successful");
        setIsLoading(false);
        return { success: true };
      } else {
        console.error("❌ Registration failed:", data.error);
        setIsLoading(false);

        // Provide specific error messages based on status code
        let errorMessage = data.error || "Erro ao criar conta";

        if (response.status === 409) {
          errorMessage = "Este email já está em uso";
        } else if (response.status === 503) {
          errorMessage = "Serviço temporariamente indisponível. Tente novamente em alguns minutos.";
        } else if (response.status >= 500) {
          errorMessage = "Erro interno do servidor. Tente novamente.";
        }

        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("❌ Network/Connection error:", error);
      setIsLoading(false);
      return {
        success: false,
        error: "Erro de conexão. Verifique sua internet e tente novamente."
      };
    }
  };

  const logout = () => {
    setUser(null);
    setUsers([]);
    localStorage.removeItem("user");
  };

  const addUser = async (
    userData: CreateUserRequest,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Check if response is ok and has content
      if (!response.ok) {
        // For error responses, check if there's content to read
        let errorMessage = "Erro no servidor";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If we can't parse JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        return { success: false, error: errorMessage };
      }

      // For successful responses
      const data: ApiResponse<User> = await response.json();

      if (data.success && data.data) {
        setUsers((prev) => [...prev, data.data!]);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Erro desconhecido" };
      }
    } catch (error) {
      console.error("Error creating user:", error);
      return { success: false, error: "Erro de conexão" };
    }
  };

  const updateUser = async (
    id: string,
    userData: UpdateUserRequest,
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data: ApiResponse<User> = await response.json();

      if (data.success && data.data) {
        setUsers((prev) => prev.map((u) => (u.id === id ? data.data! : u)));
        return true;
      } else {
        console.error("Error updating user:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        return true;
      } else {
        console.error("Error deleting user:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  };

  const toggleUserStatus = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/users/${id}/toggle-status`, {
        method: "PATCH",
      });

      const data: ApiResponse<User> = await response.json();

      if (data.success && data.data) {
        setUsers((prev) => prev.map((u) => (u.id === id ? data.data! : u)));
        return true;
      } else {
        console.error("Error toggling user status:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        users,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
