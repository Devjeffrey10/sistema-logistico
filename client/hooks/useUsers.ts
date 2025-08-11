import { useState, useEffect } from "react";
import { apiCall } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "admin" | "operator" | "viewer";
  status: "active" | "inactive";
  image_url?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  phone: string;
  role: "admin" | "operator" | "viewer";
  password: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiCall("/api/users");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<User[]> = await response.json();

      if (data.success && data.data) {
        setUsers(data.data);
        setError(null);
      } else {
        throw new Error(data.error || "Erro ao carregar usuários");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar usuários",
      );
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (
    userData: CreateUserRequest,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiCall("/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<User> = await response.json();

      if (data.success && data.data) {
        setUsers((prev) => [data.data!, ...prev]);
        setError(null);
        return { success: true };
      } else {
        const errorMessage = data.error || "Erro ao criar usuário";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar usuário";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateUser = async (
    id: string,
    updates: Partial<User>,
  ): Promise<boolean> => {
    try {
      const response = await apiCall(`/api/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<User> = await response.json();

      if (data.success && data.data) {
        setUsers((prev) => prev.map((u) => (u.id === id ? data.data! : u)));
        setError(null);
        return true;
      } else {
        setError(data.error || "Erro ao atualizar usuário");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar usuário",
      );
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      const response = await apiCall(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setError(null);
        return true;
      } else {
        setError(data.error || "Erro ao excluir usuário");
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir usuário");
      return false;
    }
  };

  const toggleUserStatus = async (id: string): Promise<boolean> => {
    try {
      const response = await apiCall(`/api/users/${id}/toggle-status`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<User> = await response.json();

      if (data.success && data.data) {
        setUsers((prev) => prev.map((u) => (u.id === id ? data.data! : u)));
        setError(null);
        return true;
      } else {
        setError(data.error || "Erro ao alterar status do usuário");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao alterar status do usuário",
      );
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    refetch: fetchUsers,
  };
}
