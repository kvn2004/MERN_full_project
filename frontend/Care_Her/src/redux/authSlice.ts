/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient.ts";
import type { AuthState, AuthResponse } from "../types.ts";
import { addNotification, type NotificationType } from "./uiSlice.ts";

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
  async (userData: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosClient.post("/auth/register", userData);
      dispatch(
        addNotification({
          type: "success",
          message: "Welcome to CareHer. Please check your email.",
        })
      );
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Signup failed";
      dispatch(addNotification({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosClient.post("/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      dispatch(addNotification({ type: "success", message: "Logged in successfully." }));
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      dispatch(addNotification({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosClient.post("/auth/forgot-password", {
        email,
      });
      const message = response.data.message || "Reset link sent to your email.";
      dispatch(addNotification({ type: "success", message }));
      return message;
    } catch (err: any) {
      const message = err.response?.data?.message || "Request failed";
      dispatch(addNotification({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosClient.post(`/auth/reset-password/${token}`, {
        password,
      });
      const message = response.data.message || "Password reset successful.";
      dispatch(addNotification({ type: "success", message }));
      return message;
    } catch (err: any) {
      const message = err.response?.data?.message || "Reset failed";
      dispatch(addNotification({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (code: string, { rejectWithValue, dispatch }) => {
    try {
      // Updated to POST with { code } as per user request
      const response = await axiosClient.post(
        "/auth/verify-email",
        { code },
        { withCredentials: true }
      );
      const message = response.data.message || "Email verified successfully!";
      dispatch(addNotification({ type: "success", message }));
      return message;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Verification failed. Please check the code.";
      dispatch(addNotification({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const saveCycleData = createAsyncThunk(
  "auth/saveCycleData",
  async (cycleData: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosClient.post("/cycle/add", cycleData);
      dispatch(addNotification({ type: "success", message: "Cycle data saved." }));
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to save cycle data";
      dispatch(addNotification({ type: "error", message }));
      return rejectWithValue(message);
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

