import { useState, useEffect } from "react";

export interface FuelTrip {
  id: string;
  trip_date: string;
  destination: string;
  driver_id: string;
  vehicle_id: string;
  fuel_cost: number;
  observations?: string;
  has_image: boolean;
  status: "completed" | "pending";
  created_at?: string;
  updated_at?: string;
  // Joined data
  driver?: {
    id: string;
    name: string;
  };
  vehicle?: {
    id: string;
    plate: string;
    model: string;
    brand: string;
  };
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export function useFuelTrips() {
  const [trips, setTrips] = useState<FuelTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/trips");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<FuelTrip[]> = await response.json();

      if (data.success && data.data) {
        setTrips(data.data);
        setError(null);
      } else {
        throw new Error(data.error || "Erro ao carregar viagens");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar viagens");
    } finally {
      setLoading(false);
    }
  };

  const addTrip = async (
    trip: Omit<
      FuelTrip,
      "id" | "created_at" | "updated_at" | "driver" | "vehicle"
    >,
  ) => {
    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trip),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<FuelTrip> = await response.json();

      if (data.success && data.data) {
        setTrips((prev) => [data.data!, ...prev]);
        setError(null);
        return data.data;
      } else {
        throw new Error(data.error || "Erro ao adicionar viagem");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar viagem");
      throw err;
    }
  };

  const updateTrip = async (id: string, updates: Partial<FuelTrip>) => {
    try {
      const response = await fetch(`/api/trips/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<FuelTrip> = await response.json();

      if (data.success && data.data) {
        setTrips((prev) => prev.map((t) => (t.id === id ? data.data! : t)));
        setError(null);
        return data.data;
      } else {
        throw new Error(data.error || "Erro ao atualizar viagem");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar viagem");
      throw err;
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      const response = await fetch(`/api/trips/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setTrips((prev) => prev.filter((t) => t.id !== id));
        setError(null);
      } else {
        throw new Error(data.error || "Erro ao excluir viagem");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir viagem");
      throw err;
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return {
    trips,
    loading,
    error,
    addTrip,
    updateTrip,
    deleteTrip,
    refetch: fetchTrips,
  };
}
