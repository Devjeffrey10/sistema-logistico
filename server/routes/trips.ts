import { RequestHandler } from "express";
import { z } from "zod";
import { ApiResponse } from "@shared/api";

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

// Simple in-memory storage (will be replaced with Supabase integration)
let trips: FuelTrip[] = [
  {
    id: "1",
    trip_date: "2024-12-01",
    destination: "São Paulo - SP",
    driver_id: "1",
    vehicle_id: "1",
    fuel_cost: 450.0,
    observations: "Viagem sem intercorrências",
    has_image: false,
    status: "completed",
    created_at: "2024-12-01",
    updated_at: "2024-12-01",
    driver: {
      id: "1",
      name: "João Silva",
    },
    vehicle: {
      id: "1",
      plate: "ABC-1234",
      model: "Actros",
      brand: "Mercedes-Benz",
    },
  },
];

// Validation schemas
const createTripSchema = z.object({
  trip_date: z.string().min(1, "Data da viagem é obrigatória"),
  destination: z.string().min(1, "Destino é obrigatório"),
  driver_id: z.string().min(1, "Motorista é obrigatório"),
  vehicle_id: z.string().min(1, "Veículo é obrigatório"),
  fuel_cost: z.number().min(0, "Custo do combustível deve ser maior que zero"),
  observations: z.string().optional(),
  has_image: z.boolean().default(false),
  status: z.enum(["completed", "pending"]).default("pending"),
});

const updateTripSchema = z.object({
  trip_date: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  driver_id: z.string().min(1).optional(),
  vehicle_id: z.string().min(1).optional(),
  fuel_cost: z.number().min(0).optional(),
  observations: z.string().optional(),
  has_image: z.boolean().optional(),
  status: z.enum(["completed", "pending"]).optional(),
});

// Mock data for drivers and vehicles (in real app, this would come from database)
const mockDrivers = [
  { id: "1", name: "João Silva" },
  { id: "2", name: "Maria Santos" },
];

const mockVehicles = [
  { id: "1", plate: "ABC-1234", model: "Actros", brand: "Mercedes-Benz" },
  { id: "2", plate: "DEF-5678", model: "FH", brand: "Volvo" },
];

// Helper function to get driver info
const getDriverInfo = (driverId: string) => {
  return mockDrivers.find((d) => d.id === driverId);
};

// Helper function to get vehicle info
const getVehicleInfo = (vehicleId: string) => {
  return mockVehicles.find((v) => v.id === vehicleId);
};

// Get all trips
export const handleGetTrips: RequestHandler = async (req, res) => {
  try {
    // Add driver and vehicle info to trips
    const tripsWithDetails = trips.map((trip) => ({
      ...trip,
      driver: getDriverInfo(trip.driver_id),
      vehicle: getVehicleInfo(trip.vehicle_id),
    }));

    const response: ApiResponse<FuelTrip[]> = {
      success: true,
      data: tripsWithDetails,
    };
    res.json(response);
  } catch (error) {
    console.error("Get trips error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao buscar viagens",
    };
    res.status(500).json(response);
  }
};

// Create trip
export const handleCreateTrip: RequestHandler = async (req, res) => {
  try {
    const validation = createTripSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: validation.error.errors[0]?.message || "Dados inválidos",
      };
      return res.status(400).json(response);
    }

    const tripData = validation.data;

    // Generate new ID
    const newId = (
      Math.max(...trips.map((t) => parseInt(t.id))) + 1
    ).toString();

    const newTrip: FuelTrip = {
      id: newId,
      ...tripData,
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
      driver: getDriverInfo(tripData.driver_id),
      vehicle: getVehicleInfo(tripData.vehicle_id),
    };

    trips.push(newTrip);

    const response: ApiResponse<FuelTrip> = {
      success: true,
      data: newTrip,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Create trip error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao criar viagem",
    };
    res.status(500).json(response);
  }
};

// Update trip
export const handleUpdateTrip: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: "ID da viagem é obrigatório",
      };
      return res.status(400).json(response);
    }

    const validation = updateTripSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: validation.error.errors[0]?.message || "Dados inválidos",
      };
      return res.status(400).json(response);
    }

    const updateData = validation.data;
    const tripIndex = trips.findIndex((t) => t.id === id);

    if (tripIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Viagem não encontrada",
      };
      return res.status(404).json(response);
    }

    // Update trip
    trips[tripIndex] = {
      ...trips[tripIndex],
      ...updateData,
      updated_at: new Date().toISOString().split("T")[0],
    };

    // Add driver and vehicle info
    const updatedTrip = {
      ...trips[tripIndex],
      driver: getDriverInfo(trips[tripIndex].driver_id),
      vehicle: getVehicleInfo(trips[tripIndex].vehicle_id),
    };

    const response: ApiResponse<FuelTrip> = {
      success: true,
      data: updatedTrip,
    };

    res.json(response);
  } catch (error) {
    console.error("Update trip error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao atualizar viagem",
    };
    res.status(500).json(response);
  }
};

// Delete trip
export const handleDeleteTrip: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: "ID da viagem é obrigatório",
      };
      return res.status(400).json(response);
    }

    const tripIndex = trips.findIndex((t) => t.id === id);

    if (tripIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Viagem não encontrada",
      };
      return res.status(404).json(response);
    }

    trips.splice(tripIndex, 1);

    const response: ApiResponse = {
      success: true,
      data: { message: "Viagem removida com sucesso" },
    };

    res.json(response);
  } catch (error) {
    console.error("Delete trip error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao remover viagem",
    };
    res.status(500).json(response);
  }
};
