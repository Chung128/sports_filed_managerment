import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";

// ✅ Gửi OTP khi đăng ký (hoặc gửi lại nếu cần)
// export const sendOtpApi = async (email) => {
//     try {
//         const response = await axios.post(`${BASE_URL}/register`, { email });
//         return response.data;
//     } catch (error) {
//         console.error("Lỗi gửi OTP:", error);
//         throw error.response?.data || error;
//     }
// };

export const verifyOtpApi = async (email, otp) => {
    try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("otp", otp);

        const response = await axios.post(`${BASE_URL}/verify_otp`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi xác thực OTP:", error);
        throw error.response?.data || error;
    }
};

// ✅ Gửi lại OTP nếu chưa nhận được
export const resendOtpApi = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, { email });
        return response.data;
    } catch (error) {
        console.error(" Lỗi gửi lại OTP:", error);
        throw error.response?.data || error;
    }
};
