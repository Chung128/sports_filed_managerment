import axios from "axios";

export const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";

const api = axios.create({
    baseURL: API_BASE + "/api/v1/booking",
    withCredentials: true, // nếu bạn dùng cookie / session auth
    headers: {
        "Content-Type": "application/json"
    }
});

// ✅ Interceptor tự động thêm token JWT từ localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // lấy token đã lưu
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
