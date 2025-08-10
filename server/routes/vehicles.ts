import { RequestHandler } from "express";
import { z } from "zod";
import { ApiResponse } from "@shared/api";

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: string;
  capacity?: string;
  fuel_type: "diesel" | "gasoline" | "ethanol";
  status: "active" | "inactive" | "maintenance";
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Simple in-memory storage (will be replaced with Supabase integration)
let vehicles: Vehicle[] = [
  {
    id: "1",
    plate: "ABC-1234",
    model: "Actros",
    brand: "Mercedes-Benz",
    year: "2020",
    capacity: "15 toneladas",
    fuel_type: "diesel",
    status: "active",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "2",
    plate: "DEF-5678",
    model: "FH",
    brand: "Volvo",
    year: "2019",
    capacity: "20 toneladas",
    fuel_type: "diesel",
    status: "active",
    created_at: "2024-01-02",
    updated_at: "2024-01-02",
  },
];

// Validation schemas
const createVehicleSchema = z.object({
  plate: z.string().min(1, "Placa é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  brand: z.string().min(1, "Marca é obrigatória"),
  year: z.string().min(1, "Ano é obrigatório"),
  capacity: z.string().optional(),
  fuel_type: z.enum(["diesel", "gasoline", "ethanol"]),
  image_url: z.string().optional(),
});

const updateVehicleSchema = z.object({
  plate: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  year: z.string().min(1).optional(),
  capacity: z.string().optional(),
  fuel_type: z.enum(["diesel", "gasoline", "ethanol"]).optional(),
  status: z.enum(["active", "inactive", "maintenance"]).optional(),
  image_url: z.string().optional(),
});

// Get all vehicles
export const handleGetVehicles: RequestHandler = async (req, res) => {
  try {
    const response: ApiResponse<Vehicle[]> = {
      success: true,
      data: vehicles,
    };
    res.json(response);
  } catch (error) {
    console.error("Get vehicles error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao buscar veículos",
    };
    res.status(500).json(response);
  }
};

// Create vehicle
export const handleCreateVehicle: RequestHandler = async (req, res) => {
  try {
    const validation = createVehicleSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: validation.error.errors[0]?.message || "Dados inválidos",
      };
      return res.status(400).json(response);
    }

    const vehicleData = validation.data;

    // Check if plate already exists
    if (vehicles.some((v) => v.plate === vehicleData.plate)) {
      const response: ApiResponse = {
        success: false,
        error: "Esta placa já está cadastrada",
      };
      return res.status(409).json(response);
    }

    // Generate new ID
    const newId = (
      Math.max(...vehicles.map((v) => parseInt(v.id))) + 1
    ).toString();

    const newVehicle: Vehicle = {
      id: newId,
      ...vehicleData,
      status: "active",
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };

    vehicles.push(newVehicle);

    const response: ApiResponse<Vehicle> = {
      success: true,
      data: newVehicle,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Create vehicle error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao criar veículo",
    };
    res.status(500).json(response);
  }
};

// Update vehicle
export const handleUpdateVehicle: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: "ID do veículo é obrigatório",
      };
      return res.status(400).json(response);
    }

    const validation = updateVehicleSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: validation.error.errors[0]?.message || "Dados inválidos",
      };
      return res.status(400).json(response);
    }

    const updateData = validation.data;
    const vehicleIndex = vehicles.findIndex((v) => v.id === id);

    if (vehicleIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Veículo não encontrado",
      };
      return res.status(404).json(response);
    }

    // Check if plate is being updated and already exists
    if (
      updateData.plate &&
      vehicles.some((v) => v.plate === updateData.plate && v.id !== id)
    ) {
      const response: ApiResponse = {
        success: false,
        error: "Esta placa já está cadastrada",
      };
      return res.status(409).json(response);
    }

    // Update vehicle
    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      ...updateData,
      updated_at: new Date().toISOString().split("T")[0],
    };

    const response: ApiResponse<Vehicle> = {
      success: true,
      data: vehicles[vehicleIndex],
    };

    res.json(response);
  } catch (error) {
    console.error("Update vehicle error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao atualizar veículo",
    };
    res.status(500).json(response);
  }
};

// Delete vehicle
export const handleDeleteVehicle: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: "ID do veículo é obrigatório",
      };
      return res.status(400).json(response);
    }

    const vehicleIndex = vehicles.findIndex((v) => v.id === id);

    if (vehicleIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Veículo não encontrado",
      };
      return res.status(404).json(response);
    }

    vehicles.splice(vehicleIndex, 1);

    const response: ApiResponse = {
      success: true,
      data: { message: "Veículo removido com sucesso" },
    };

    res.json(response);
  } catch (error) {
    console.error("Delete vehicle error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao remover veículo",
    };
    res.status(500).json(response);
  }
};
