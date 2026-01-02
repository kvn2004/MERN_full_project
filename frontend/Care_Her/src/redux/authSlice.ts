/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient.ts";
import type { AuthState, AuthResponse } from "../types.ts";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true, // IMPORTANT
  error: null,
  successMessage: null,
};

export const signup = createAsyncThunk(
  "/auth/register",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/register", userData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/forgot-password", {
        email,
      });
      return response.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Request failed");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }: any, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/auth/reset-password/${token}`, {
        password,
      });
      return response.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Reset failed");
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (code: string, { rejectWithValue }) => {
    try {
      // Updated to POST with { code } as per user request
      const response = await axiosClient.post(
        "/auth/verify-email",
        { code },
        { withCredentials: true }
      );
      return response.data.message || "Email verified successfully!";
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Verification failed. Please check the code."
      );
    }
  }
);
export const saveCycleData = createAsyncThunk(
  "auth/saveCycleData",
  async (cycleData: any, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/cycle/add", cycleData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to save cycle data"
      );
    }
  }
);
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/auth/check-auth", {
        withCredentials: true,
      });
      return res.data.user;
    } catch {
      return rejectWithValue(null);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Signup successful! Please verify your email.";
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        forgotPassword.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.successMessage = action.payload;
        }
      )
      .addCase(
        resetPassword.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.successMessage = action.payload;
        }
      )
      .addCase(
        verifyEmail.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.successMessage = action.payload;
        }
      );
  },
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;
