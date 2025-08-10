import { useState, useEffect } from "react";
import { Driver } from "@/lib/supabase";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/drivers");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Driver[]> = await response.json();

      if (data.success && data.data) {
        setDrivers(data.data);
        setError(null);
      } else {
        throw new Error(data.error || "Erro ao carregar motoristas");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar motoristas",
      );
    } finally {
      setLoading(false);
    }
  };

  const addDriver = async (
    driver: Omit<Driver, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      const response = await fetch("/api/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(driver),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Driver> = await response.json();

      if (data.success && data.data) {
        setDrivers((prev) => [data.data!, ...prev]);
        setError(null);
        return data.data;
      } else {
        throw new Error(data.error || "Erro ao adicionar motorista");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao adicionar motorista",
      );
      throw err;
    }
  };

  const updateDriver = async (id: string, updates: Partial<Driver>) => {
    try {
      const response = await fetch(`/api/drivers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Driver> = await response.json();

      if (data.success && data.data) {
        setDrivers((prev) => prev.map((d) => (d.id === id ? data.data! : d)));
        setError(null);
        return data.data;
      } else {
        throw new Error(data.error || "Erro ao atualizar motorista");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar motorista",
      );
      throw err;
    }
  };

  const deleteDriver = async (id: string) => {
    try {
      const response = await fetch(`/api/drivers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setDrivers((prev) => prev.filter((d) => d.id !== id));
        setError(null);
      } else {
        throw new Error(data.error || "Erro ao excluir motorista");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao excluir motorista",
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return {
    drivers,
    loading,
    error,
    addDriver,
    updateDriver,
    deleteDriver,
    refetch: fetchDrivers,
  };
}
