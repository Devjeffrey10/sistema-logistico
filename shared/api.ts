/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * User interfaces for API communication
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  phone: string;
  status: "active" | "inactive";
  createdAt: string;
  lastLogin?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: "admin" | "operator" | "viewer";
  phone: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: "admin" | "operator" | "viewer";
  phone?: string;
  status?: "active" | "inactive";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "operator" | "viewer";
  };
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
