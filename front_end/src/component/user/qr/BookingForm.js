// src/pages/QrPaymentPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../service/user/booking/qrApi";

export default function QrPaymentPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [error, setError] = useState("");

    //xóa khi tắt tab
    useEffect(() => {
        const cancelOnClose = () => {
            if (qrData?.txnRef) {
                navigator.sendBeacon(`/api/v1/booking/cancel/${qrData.txnRef}`);
            }
        };

        window.addEventListener("beforeunload", cancelOnClose);
        return () => window.removeEventListener("beforeunload", cancelOnClose);
    }, [qrData]);


    useEffect(() => {
        const payloadStr = localStorage.getItem("bookingQrPayload");
        if (!payloadStr) {
            setError("Không tìm thấy dữ liệu đặt sân. Vui lòng thử lại.");
            return;
        }

        const payload = JSON.parse(payloadStr);
        if (!payload || !payload.courtId || !payload.specificDate || !payload.timeSlots?.length) {
            setError("Dữ liệu đặt sân không hợp lệ.");
            return;
        }

        const createQr = async () => {
            try {
                setLoading(true);
                const res = await api.post("/create-qr", payload);
                // res.data = { txnRef, amount, qrImage, message }
                setQrData({
                    txnRef: res.data.txnRef,
                    amount: res.data.amount,
                    qrBase64: res.data.qrImage,
                });
            } catch (e) {
                console.error(e);
                setError(e?.response?.data?.message || e.message || "Lỗi tạo QR");
            } finally {
                setLoading(false);
            }
        };

        createQr();
    }, []);

    const handleDone = () => {
        localStorage.removeItem("bookingQrPayload");
        navigate("/booking-result"); // hoặc trang home
    };

    const handleCancelPayment = async () => {
        if (!qrData?.txnRef) {
            handleDone();
            return;
        }

        try {
            await api.post(`/cancel/${qrData.txnRef}`);
        } catch (e) {
            console.error("Cancel failed", e);
        } finally {
            localStorage.removeItem("bookingQrPayload");
            navigate("/booking");
        }
    };


    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button
                    onClick={() => navigate("/booking")}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            {loading && <p className="text-gray-600 font-medium">Đang tạo QR...</p>}

            {qrData && (
                <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
                    <h2 className="text-xl font-bold">Thanh toán QR</h2>
                    <p>Chủ tài khoản : <span className="font-mono">
                        {/*{qrData.txnRef}*/}
                        Trần Văn Chung
                    </span>
                    </p>
                    <p>Ngân hàng : <span className="font-mono">
                        {/*{qrData.txnRef}*/}
                        Techcombank
                    </span>
                    </p>
                    <p>Số tiền: <span className="font-bold">{qrData.amount.toLocaleString()}đ</span></p>
                    <img
                        src={`data:image/png;base64,${qrData.qrBase64}`}
                        alt="QR Code"
                        className="w-64 h-64"
                    />
                    <button
                        onClick={handleCancelPayment}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 mt-4"
                    >
                        Hủy thanh toán
                    </button>
                </div>
            )}
        </div>
    );
}
