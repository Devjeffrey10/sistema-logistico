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

      // Read response as text first to avoid body stream issues
      let responseText: string;
      try {
        responseText = await response.text();
      } catch (textError) {
        console.error("Failed to read login response text:", textError);
        setIsLoading(false);
        return false;
      }

      // Parse response text as JSON
      let data: LoginResponse;
      try {
        if (!responseText.trim()) {
          throw new Error("Empty response");
        }
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse login JSON from text:", parseError);
        console.error("Login response text was:", responseText);
        setIsLoading(false);
        return false;
      }

      if (response.ok && data.success && data.user) {
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

      // Use XMLHttpRequest instead of fetch to avoid any potential middleware interference
      const result = await new Promise<{ success: boolean; error?: string }>(
        (resolve) => {
          const xhr = new XMLHttpRequest();

          xhr.open("POST", "/api/auth/register", true);
          xhr.setRequestHeader("Content-Type", "application/json");

          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              console.log(
                "📡 XHR Response status:",
                xhr.status,
                xhr.statusText,
              );
              console.log("📄 XHR Response text:", xhr.responseText);

              try {
                // Parse the response
                let data: LoginResponse;
                if (!xhr.responseText.trim()) {
                  resolve({
                    success: false,
                    error: "Resposta vazia do servidor",
                  });
                  return;
                }

                try {
                  data = JSON.parse(xhr.responseText);
                } catch (parseError) {
                  console.error("Failed to parse JSON:", parseError);
                  resolve({
                    success: false,
                    error: `Erro do servidor (${xhr.status}): Resposta inválida`,
                  });
                  return;
                }

                if (xhr.status >= 200 && xhr.status < 300 && data.success) {
                  console.log("✅ Registration successful");
                  resolve({ success: true });
                } else {
                  console.error("❌ Registration failed:", data.error);

                  // Provide specific error messages based on status code
                  let errorMessage = data.error || "Erro ao criar conta";

                  if (xhr.status === 409) {
                    errorMessage = "Este email já está em uso";
                  } else if (xhr.status === 503) {
                    errorMessage =
                      "Serviço temporariamente indisponível. Tente novamente em alguns minutos.";
                  } else if (xhr.status >= 500) {
                    errorMessage = "Erro interno do servidor. Tente novamente.";
                  }

                  resolve({ success: false, error: errorMessage });
                }
              } catch (error) {
                console.error("XHR error handling failed:", error);
                resolve({
                  success: false,
                  error: "Erro interno de processamento",
                });
              }
            }
          };

          xhr.onerror = function () {
            console.error("XHR network error");
            resolve({
              success: false,
              error:
                "Erro de conexão. Verifique sua internet e tente novamente.",
            });
          };

          xhr.ontimeout = function () {
            console.error("XHR timeout");
            resolve({
              success: false,
              error: "Timeout: O servidor demorou muito para responder.",
            });
          };

          xhr.timeout = 10000; // 10 second timeout

          // Send the request
          xhr.send(JSON.stringify(userData));
        },
      );

      setIsLoading(false);
      return result;
    } catch (error) {
      console.error("❌ Registration error:", error);
      setIsLoading(false);
      return {
        success: false,
        error: "Erro de conexão. Verifique sua internet e tente novamente.",
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
