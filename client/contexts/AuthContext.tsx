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

      const data: LoginResponse = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
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
