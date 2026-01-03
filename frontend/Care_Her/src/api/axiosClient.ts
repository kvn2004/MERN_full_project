import axios from "axios";
import { addNotification } from "../redux/uiSlice";
import { store } from "../redux/store";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT token to requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global errors (like 401 Unauthorized)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Redirect to login if needed or handle in state
    }
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    // Automatically notify users of API errors
    store.dispatch(addNotification({ type: 'error', message }));

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Could also trigger a redirect to login here if not on a login page
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
