import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Clock, Send } from "lucide-react";
import {resendOtpApi, verifyOtpApi} from "../../../service/user/login/otpApi"; // Import icon

export default function VerifyOtp() {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [resendTimer, setResendTimer] = useState(60); // Timer 60 giây

    // Ref cho input OTP
    const otpInputRef = useRef(null);

    // --- Logic Lấy Email ---
    useEffect(() => {
        // Lấy email truyền từ trang đăng ký
        if (location.state?.email) {
            setEmail(location.state.email);
            // Focus vào input OTP khi component load
            otpInputRef.current?.focus();
        } else {
            // Trường hợp người dùng truy cập trực tiếp, chuyển họ về trang đăng ký
            toast.error("Không tìm thấy email đăng ký. Vui lòng đăng ký lại.");
            navigate("/register", { replace: true });
        }
    }, [location, navigate]);

    // --- Logic Timer Gửi lại OTP ---
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);


    // --- Hàm Xác thực OTP ---
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error("Mã OTP phải có 6 chữ số!");
            return;
        }

        try {
            // Giả sử API yêu cầu email và otp
            await verifyOtpApi(email, otp);
            toast.success(" Xác thực OTP thành công! Tài khoản đã được đăng kí.");
            navigate("/login"); // Chuyển hướng sau khi xác thực xong
        } catch (error) {
            const errorMessage = error.response?.data?.message || `OTP không chính xác hoặc đã hết hạn!`;
            toast.error(errorMessage);
        }
    };

    // --- Hàm Gửi lại OTP ---
    const handleResendOtp = async () => {
        if (resendTimer > 0) return; // Không gửi lại nếu timer còn

        try {
            await resendOtpApi(email);
            toast.success("📨 OTP mới đã được gửi lại!");
            setResendTimer(60); // Reset timer
        } catch (error) {
            toast.error(`Gửi lại OTP thất bại: ${error.response?.data?.message || "Lỗi server"}`);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-500 p-4">
            {/* Form Container */}
            <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-sm border border-gray-200 text-center">
                <h2 className="text-3xl font-extrabold mb-3 text-gray-800">
                    Xác thực OTP
                </h2>
                <p className="text-gray-500 mb-8 text-base">
                    Chúng tôi đã gửi mã xác thực 6 chữ số đến email của bạn.
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    {/* Trường Email (Disabled) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email của bạn</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-2 border border-blue-200 rounded-lg bg-blue-50 text-gray-700 text-center font-medium"
                        />
                    </div>

                    {/* Input OTP */}
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Nhập mã OTP (6 chữ số)</label>
                        <input
                            ref={otpInputRef}
                            id="otp"
                            type="text"
                            placeholder="● ● ● ● ● ● ●"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                            maxLength={6}
                            required
                            pattern="\d{6}"
                            className="w-full px-4 py-3 text-center text-xl tracking-[1em] border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 font-mono"
                        />
                    </div>

                    {/* Nút Xác thực */}
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-xl focus:ring-4 focus:ring-blue-300 focus:outline-none"
                    >
                        Xác thực OTP
                    </button>
                </form>

                {/* Khu vực Gửi lại OTP */}
                <div className="mt-8 pt-4 border-t border-gray-100">
                    {resendTimer > 0 ? (
                        <p className="text-sm text-gray-500 flex items-center justify-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Có thể gửi lại sau: <span className="font-bold text-blue-600 ml-1">{resendTimer}s</span>
                        </p>
                    ) : (
                        <button
                            onClick={handleResendOtp}
                            disabled={!email || resendTimer > 0}
                            className={`w-full py-2 flex items-center justify-center gap-2 font-medium rounded-lg transition ${
                                email
                                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            <Send className="w-4 h-4" /> Gửi lại mã OTP
                        </button>
                    )}
                </div>

                {/* Quay lại đăng nhập */}
                <p className="mt-4 text-center text-sm text-gray-500">
                    <Link to="/register" className="font-medium text-gray-600 hover:text-blue-600 hover:underline transition">
                        Quay lại trang đăng kí
                    </Link>
                </p>
            </div>
        </div>
    );
}