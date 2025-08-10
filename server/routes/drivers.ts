import { RequestHandler } from "express";
import { z } from "zod";
import { ApiResponse } from "@shared/api";

export interface Driver {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  cnh: string;
  cnh_category: "D" | "E";
  cnh_expiry: string;
  status: "active" | "inactive";
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Simple in-memory storage (will be replaced with Supabase integration)
let drivers: Driver[] = [];

// Validation schemas
const createDriverSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(1, "CPF é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  cnh: z.string().min(1, "CNH é obrigatória"),
  cnh_category: z.enum(["D", "E"]),
  cnh_expiry: z.string().min(1, "Data de vencimento da CNH é obrigatória"),
  image_url: z.string().optional(),
});

const updateDriverSchema = z.object({
  name: z.string().min(1).optional(),
  cpf: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  cnh: z.string().min(1).optional(),
  cnh_category: z.enum(["D", "E"]).optional(),
  cnh_expiry: z.string().min(1).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  image_url: z.string().optional(),
});

// Get all drivers
export const handleGetDrivers: RequestHandler = async (req, res) => {
  try {
    const response: ApiResponse<Driver[]> = {
      success: true,
      data: drivers,
    };
    res.json(response);
  } catch (error) {
    console.error("Get drivers error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao buscar motoristas",
    };
    res.status(500).json(response);
  }
};

// Create driver
export const handleCreateDriver: RequestHandler = async (req, res) => {
  try {
    const validation = createDriverSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: validation.error.errors[0]?.message || "Dados inválidos",
      };
      return res.status(400).json(response);
    }

    const driverData = validation.data;

    // Check if CPF already exists
    if (drivers.some((d) => d.cpf === driverData.cpf)) {
      const response: ApiResponse = {
        success: false,
        error: "Este CPF já está cadastrado",
      };
      return res.status(409).json(response);
    }

    // Check if CNH already exists
    if (drivers.some((d) => d.cnh === driverData.cnh)) {
      const response: ApiResponse = {
        success: false,
        error: "Esta CNH já está cadastrada",
      };
      return res.status(409).json(response);
    }

    // Generate new ID
    const newId = (
      Math.max(...drivers.map((d) => parseInt(d.id))) + 1
    ).toString();

    const newDriver: Driver = {
      id: newId,
      ...driverData,
      status: "active",
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };

    drivers.push(newDriver);

    const response: ApiResponse<Driver> = {
      success: true,
      data: newDriver,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Create driver error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao criar motorista",
    };
    res.status(500).json(response);
  }
};

// Update driver
export const handleUpdateDriver: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: "ID do motorista é obrigatório",
      };
      return res.status(400).json(response);
    }

    const validation = updateDriverSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: validation.error.errors[0]?.message || "Dados inválidos",
      };
      return res.status(400).json(response);
    }

    const updateData = validation.data;
    const driverIndex = drivers.findIndex((d) => d.id === id);

    if (driverIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Motorista não encontrado",
      };
      return res.status(404).json(response);
    }

    // Check if CPF is being updated and already exists
    if (
      updateData.cpf &&
      drivers.some((d) => d.cpf === updateData.cpf && d.id !== id)
    ) {
      const response: ApiResponse = {
        success: false,
        error: "Este CPF já está cadastrado",
      };
      return res.status(409).json(response);
    }

    // Check if CNH is being updated and already exists
    if (
      updateData.cnh &&
      drivers.some((d) => d.cnh === updateData.cnh && d.id !== id)
    ) {
      const response: ApiResponse = {
        success: false,
        error: "Esta CNH já está cadastrada",
      };
      return res.status(409).json(response);
    }

    // Update driver
    drivers[driverIndex] = {
      ...drivers[driverIndex],
      ...updateData,
      updated_at: new Date().toISOString().split("T")[0],
    };

    const response: ApiResponse<Driver> = {
      success: true,
      data: drivers[driverIndex],
    };

    res.json(response);
  } catch (error) {
    console.error("Update driver error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao atualizar motorista",
    };
    res.status(500).json(response);
  }
};

// Delete driver
export const handleDeleteDriver: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: "ID do motorista é obrigatório",
      };
      return res.status(400).json(response);
    }

    const driverIndex = drivers.findIndex((d) => d.id === id);

    if (driverIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Motorista não encontrado",
      };
      return res.status(404).json(response);
    }

    drivers.splice(driverIndex, 1);

    const response: ApiResponse = {
      success: true,
      data: { message: "Motorista removido com sucesso" },
    };

    res.json(response);
  } catch (error) {
    console.error("Delete driver error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao remover motorista",
    };
    res.status(500).json(response);
  }
};
