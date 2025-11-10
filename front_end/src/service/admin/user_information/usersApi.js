import axios from "axios";

const API_BASE = "http://localhost:8080/api/admin";

const getToken = () => localStorage.getItem("token");

export const fetchUsers = async () => {
    try {
        const token = getToken();
        const res = await axios.get(`${API_BASE}/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Lỗi khi tải danh sách người dùng:", err);
        throw err;
    }
};

export const fetchUserDetail = async (userId) => {
    try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/${userId}/detail`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Lỗi khi tải chi tiết user");
        return res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
};
