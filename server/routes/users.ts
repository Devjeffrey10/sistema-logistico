import { RequestHandler } from "express";
import { z } from "zod";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  LoginRequest,
  ApiResponse,
  LoginResponse,
} from "@shared/api";

// Simple in-memory storage (will be replaced with Supabase)
let users: (User & { password: string })[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@transportadora.com",
    password: "admin123",
    role: "admin",
    phone: "(11) 99999-9999",
    status: "active",
    createdAt: "2024-01-01",
    lastLogin: "2024-01-15",
  },
];

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["admin", "operator", "viewer"]),
  phone: z.string().min(1, "Telefone é obrigatório"),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(["admin", "operator", "viewer"]).optional(),
  phone: z.string().min(1).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Utility function to exclude password from user object
const excludePassword = (user: User & { password: string }): User => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Login endpoint
export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      const response: LoginResponse = {
        success: false,
        error: validation.error.errors[0]?.message || "Dados inválidos",
      };
      return res.status(400).json(response);
    }

    const { email, password } = validation.data;

    const user = users.find(
      (u) =>
        u.email === email && u.password === password && u.status === "active",
    );

    if (!user) {
      const response: LoginResponse = {
        success: false,
        error: "Email ou senha incorretos",
      };
      return res.status(401).json(response);
    }

    // Update last login
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date().toISOString().split("T")[0];
    }

    const response: LoginResponse = {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    const response: LoginResponse = {
      success: false,
      error: "Erro interno do servidor",
    };
    res.status(500).json(response);
  }
};

// Get all users
export const handleGetUsers: RequestHandler = async (req, res) => {
  try {
    const usersWithoutPasswords = users.map(excludePassword);
    const response: ApiResponse<User[]> = {
      success: true,
      data: usersWithoutPasswords,
    };
    res.json(response);
  } catch (error) {
    console.error("Get users error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao buscar usuários",
    };
    res.status(500).json(response);
  }
};

// Create user
export const handleCreateUser: RequestHandler = async (req, res) => {
  try {
    console.log("Create user request body:", req.body);
    console.log("Request headers:", req.headers);

    const validation = createUserSchema.safeParse(req.body);

    if (!validation.success) {
      console.log("Validation errors:", validation.error.errors);
      const response: ApiResponse = {
        success: false,
        error: validation.error.errors[0]?.message || "Dados inválidos",
      };
      return res.status(400).json(response);
    }

    const userData = validation.data;

    // Check if email already exists
    if (users.some((u) => u.email === userData.email)) {
      const response: ApiResponse = {
        success: false,
        error: "Este email já está em uso",
      };
      return res.status(409).json(response);
    }

    // Generate new ID
    const newId = (
      Math.max(...users.map((u) => parseInt(u.id))) + 1
    ).toString();

    const newUser: User & { password: string } = {
      id: newId,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      phone: userData.phone,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    users.push(newUser);

    const response: ApiResponse<User> = {
      success: true,
      data: excludePassword(newUser),
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Create user error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao criar usuário",
    };
    res.status(500).json(response);
  }
};

// Update user
export const handleUpdateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: "ID do usuário é obrigatório",
      };
      return res.status(400).json(response);
    }

    const validation = updateUserSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: validation.error.errors[0]?.message || "Dados inválidos",
      };
      return res.status(400).json(response);
    }

    const updateData = validation.data;
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Usuário não encontrado",
      };
      return res.status(404).json(response);
    }

    // Check if email is being updated and already exists
    if (
      updateData.email &&
      users.some((u) => u.email === updateData.email && u.id !== id)
    ) {
      const response: ApiResponse = {
        success: false,
        error: "Este email já está em uso",
      };
      return res.status(409).json(response);
    }

    // Update user
    users[userIndex] = { ...users[userIndex], ...updateData };

    const response: ApiResponse<User> = {
      success: true,
      data: excludePassword(users[userIndex]),
    };

    res.json(response);
  } catch (error) {
    console.error("Update user error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao atualizar usuário",
    };
    res.status(500).json(response);
  }
};

// Delete user
export const handleDeleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: "ID do usuário é obrigatório",
      };
      return res.status(400).json(response);
    }

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Usuário não encontrado",
      };
      return res.status(404).json(response);
    }

    // Prevent deleting admin users
    if (users[userIndex].role === "admin") {
      const response: ApiResponse = {
        success: false,
        error: "Não é possível remover usuários administradores",
      };
      return res.status(403).json(response);
    }

    users.splice(userIndex, 1);

    const response: ApiResponse = {
      success: true,
      data: { message: "Usuário removido com sucesso" },
    };

    res.json(response);
  } catch (error) {
    console.error("Delete user error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao remover usuário",
    };
    res.status(500).json(response);
  }
};

// Toggle user status
export const handleToggleUserStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: "ID do usuário é obrigatório",
      };
      return res.status(400).json(response);
    }

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      const response: ApiResponse = {
        success: false,
        error: "Usuário não encontrado",
      };
      return res.status(404).json(response);
    }

    // Toggle status
    users[userIndex].status =
      users[userIndex].status === "active" ? "inactive" : "active";

    const response: ApiResponse<User> = {
      success: true,
      data: excludePassword(users[userIndex]),
    };

    res.json(response);
  } catch (error) {
    console.error("Toggle user status error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Erro ao alterar status do usuário",
    };
    res.status(500).json(response);
  }
};
