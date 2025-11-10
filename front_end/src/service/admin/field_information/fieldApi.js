import axios from "axios";

const API_BASE = "http://localhost:8080/api/admin/fields";

export const getAllCourts = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const getCourtById = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
export const getAllCourtTypes = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE}/types`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
