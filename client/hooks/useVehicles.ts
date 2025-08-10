import { useState, useEffect } from "react";
import { Vehicle } from "@/lib/supabase";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/vehicles");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Vehicle[]> = await response.json();

      if (data.success && data.data) {
        setVehicles(data.data);
        setError(null);
      } else {
        throw new Error(data.error || "Erro ao carregar veículos");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar veículos",
      );
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (
    vehicle: Omit<Vehicle, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicle),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Vehicle> = await response.json();

      if (data.success && data.data) {
        setVehicles((prev) => [data.data!, ...prev]);
        setError(null);
        return data.data;
      } else {
        throw new Error(data.error || "Erro ao adicionar veículo");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao adicionar veículo",
      );
      throw err;
    }
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Vehicle> = await response.json();

      if (data.success && data.data) {
        setVehicles((prev) => prev.map((v) => (v.id === id ? data.data! : v)));
        setError(null);
        return data.data;
      } else {
        throw new Error(data.error || "Erro ao atualizar veículo");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar veículo",
      );
      throw err;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setVehicles((prev) => prev.filter((v) => v.id !== id));
        setError(null);
      } else {
        throw new Error(data.error || "Erro ao excluir veículo");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir veículo");
      throw err;
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refetch: fetchVehicles,
  };
}
