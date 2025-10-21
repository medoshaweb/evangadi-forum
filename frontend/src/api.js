import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", headers: {
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

// // response interceptor: refresh token on 401
// API.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const stored = JSON.parse(localStorage.getItem("user"));
//       if (!stored?.refreshToken) return Promise.reject(error);

//       try {
//         const { data } = await axios.post(
//           "http://localhost:5000/api/refresh-token",
//           { refreshToken: stored.refreshToken }
//         );
//         // update token in localStorage
//         localStorage.setItem(
//           "user",
//           JSON.stringify({ ...stored, token: data.token })
//         );
//         // retry original request
//         originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
//         return axios(originalRequest);
//       } catch (err) {
//         console.error("Refresh token failed", err);
//         return Promise.reject(err);
//       }
//     }
//     return Promise.reject(error);
//   }
// );


