import axios from "axios";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const api = axios.create({
    // baseURL: process.env.NODE_ENV === "production" ? "http://backend:8080/api" : "http://localhost:8080/api",
    baseURL: "http://localhost:8080/api",
    headers: {"Content-Type": "application/json"},
});

// Gắn token tự động
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log("Sending request:", config);
    return config;
});

// Xử lý phản hồi để ghi log
api.interceptors.response.use(
    (response) => {
        console.log("Response received:", response);
        return response;
    },
    (error) => {
        console.error("Response error:", error);
        return Promise.reject(error);
    }
);


export const getCurrentUser = async (navigate) => {
    const token = localStorage.getItem("token");
    console.log("Token gửi BE:", token);

    try {
        const res = await api.get("/auth/me", {
            headers: {Authorization: `Bearer ${token}`},
            Accept: "application/json"
        });
        return res.data ? res.data : navigate("/login");
    } catch (error) {
        console.error("Token hết hạn hoặc không hợp lệ:", error);
        localStorage.removeItem("token");
        navigate("/login");
    }
};

export const updateUserProfile = async (formData) => {
    const token = localStorage.getItem("token");
    const res = await api.put("/auth/me", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const changePassword = async (pass) => {
    const token = localStorage.getItem("token");
    return (await api.post("/auth/change-password", pass,
        {
            headers: {
                Authorization: `Bearer${token}`
            }
        })).data
}


export const loginApi = async (username, password) => {
    const body = {username, password};
    return await api.post("/auth/login", body);
};

export const googleLoginApi = async (idToken) => {
    return await api.post("/auth/google", {idToken});
};


export const registerApi = async (formData) => {
    try {
        console.log("Sending register request to:", api.defaults.baseURL + "/auth/register");

        const response = await api.post("/auth/register", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("✅ Register response:", response.data);
        return response;
    } catch (err) {
        console.error("Register error:", err);
        throw err.response?.data || err.message;
    }
};


export default api;