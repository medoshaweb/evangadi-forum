import axios from "axios";

const API = axios.create({
  baseURL: "https://evangadi-backend-0rn9.onrender.com/api",
  headers: {
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
export default API;
