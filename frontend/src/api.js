import axios from "axios";

// ✅ use environment variable
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE, headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor: add token
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

  // response interceptor: handle token refresh
  API.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const stored = JSON.parse(localStorage.getItem("user"));
        if (!stored?.refreshToken) return Promise.reject(error);
  
        try {
          const { data } = await axios.post(`${API_BASE}/users/refresh-token`, {
            refreshToken: stored.refreshToken,
          });
  
          // Update token in localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({ ...stored, token: data.token })
          );
  
          // Retry the original request with new token
          originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
          return axios(originalRequest);
        } catch (err) {
          console.error("⚠️ Refresh token failed:", err);
          return Promise.reject(err);
        }
      }
  
      return Promise.reject(error);
    }
  );

export default API;