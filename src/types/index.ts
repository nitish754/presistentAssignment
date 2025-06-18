// User interface
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode?: number;
    stack?: string;
  };
}

// Request interfaces
export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// Environment variables interface
export interface EnvironmentVariables {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL?: string;
  JWT_SECRET?: string;
} 