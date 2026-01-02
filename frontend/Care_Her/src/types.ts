
export interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
