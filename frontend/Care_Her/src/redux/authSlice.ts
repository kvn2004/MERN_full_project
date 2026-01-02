/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../api/axiosClient.ts';
import type { AuthState, AuthResponse } from '../types.ts';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  successMessage: null,
};

export const signup = createAsyncThunk(
  '/auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('http://localhost:5000/auth/register', userData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Signup failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/forgot-password', { email });
      return response.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Request failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }: any, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/auth/reset-password/${token}`, { password });
      return response.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Reset failed');
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (code: string, { rejectWithValue }) => {
    try {
      // Updated to POST with { code } as per user request
      const response = await axiosClient.post('/auth/verify-email', { code });
      return response.data.message || 'Email verified successfully!';
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Verification failed. Please check the code.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
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
      .addCase(signup.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signup.fulfilled, (state) => { 
        state.loading = false; 
        state.successMessage = 'Signup successful! Please verify your email.'; 
      })
      .addCase(signup.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload as string; 
      })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload as string; 
      })
      .addCase(forgotPassword.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(resetPassword.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(verifyEmail.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.successMessage = action.payload;
      });
  },
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;
