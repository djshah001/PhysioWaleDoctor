import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Define the base URL - move to env later
// const API_URL =
//   process.env.EXPO_PUBLIC_API_URL || "http://10.118.240.172:5000/api/v1"; // Update with your actual API URL
const API_URL = "http://10.59.97.172:5000/api/v"; // Update with your actual API URL

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Refresh Token Interceptor
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Token expired, attempting refresh...");

        // Get refresh token from storage
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh endpoint
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        console.log("Token refreshed successfully");

        // Update tokens in AsyncStorage
        await Promise.all([
          AsyncStorage.setItem("authToken", accessToken),
          AsyncStorage.setItem("refreshToken", newRefreshToken),
        ]);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        processQueue(null, accessToken);

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Process queued requests with error
        processQueue(refreshError, null);

        // Clear all auth data
        await Promise.all([
          AsyncStorage.removeItem("authToken"),
          AsyncStorage.removeItem("refreshToken"),
          AsyncStorage.removeItem("user"),
          AsyncStorage.removeItem("isLoggedIn"),
        ]);

        // Navigate to login screen
        router.replace("/(auth)/sign-in");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
