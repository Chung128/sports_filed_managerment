import axios from "axios";

// Tạo instance Axios
const api = axios.create({
    baseURL: "http://localhost:8080/api/support",
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm interceptor để tự động gửi token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // token bạn lưu khi login
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// API gửi tin nhắn
export async function sendMessage(payload) {
    return api.post("/send", payload).then((res) => res.data);
}

// Lấy lịch sử chat
export async function getHistory(userId) {
    return api.get(`/history/${userId}`).then((res) => res.data);
}

// Lấy tất cả conversation
export async function getConversations() {
    return api.get("/conversations").then((res) => res.data);
}

// Đánh dấu conversation đã đọc
export async function markConversationRead(conversationId) {
    return api.post(`/${conversationId}/mark-read`).then((res) => res.data);
}

// Gửi tin nhắn với quyền admin
export async function sendAsAdmin(payload) {
    return api.post("/send-admin", payload).then((res) => res.data);
}

export default api;
