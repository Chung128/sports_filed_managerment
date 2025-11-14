import axios from "axios";

const API_BASE = "http://localhost:8080/api/fields";

export const updateCourtStatus = (id, newStatus) => {
    const token=localStorage.getItem("token");
    return axios.put(`${API_BASE}/${id}/status`, null, {
        params: { status: newStatus },
        headers:{Authorization:`Bearer ${token}`},
    });
};

export const getAllCourtTypes = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE}/types`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
export const getCourtsByVariant = async (variantId) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE}/variant/${variantId}`,{
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
