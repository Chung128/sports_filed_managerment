import React, { useEffect, useState, useRef } from "react";
import { useStomp } from "./useStomp";
import { API_BASE } from "../../../service/user/booking/qrApi";

/**
 * Props:
 * - open
 * - onClose
 * - txnRef
 * - amount
 * - qrBase64
 * - courtName
 * - date
 * - time
 */
export default function QrPaymentModal({
                                           open,
                                           onClose,
                                           txnRef,
                                           amount,
                                           qrBase64,
                                           courtName,
                                           date,
                                           time
                                       }) {
    const [timeLeft, setTimeLeft] = useState(5 * 60);
    const [status, setStatus] = useState("WAITING"); // WAITING | PAID | FAILED
    const pollRef = useRef(null);

    // ====== WebSocket LISTEN ======
    useStomp({
        url: process.env.REACT_APP_WS_URL || "http://localhost:8080/ws",
        topic: process.env.REACT_APP_WS_TOPIC || "/topic/payment-status",
        onMessage: (msg) => {
            // backend publish: { txnRef, status }
            if (msg && msg.txnRef === txnRef) {
                if (msg.status === "PAID") setStatus("PAID");
                if (msg.status === "FAILED") setStatus("FAILED");
            }
        }
    });

    // ====== Polling Fallback ======
    useEffect(() => {
        if (!open) return;

        setStatus("WAITING");

        const poll = async () => {
            try {
                const res = await fetch(
                    `${API_BASE}/qr-status?txnRef=${encodeURIComponent(txnRef)}`,
                    { credentials: "include" }
                );
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === "PAID") setStatus("PAID");
                    if (data.status === "FAILED") setStatus("FAILED");
                }
            } catch (e) {}
        };

        pollRef.current = setInterval(poll, 3000);
        poll();

        return () => clearInterval(pollRef.current);
    }, [open, txnRef]);

    // ====== AUTO REDIRECT ======
    useEffect(() => {
        if (!open) return;

        if (status === "PAID") {
            window.location.href =
                `/booking-result?success=true`
                + `&message=${encodeURIComponent("Thanh toán thành công!")}`
                + `&courtName=${encodeURIComponent(courtName)}`
                + `&date=${encodeURIComponent(date)}`
                + `&time=${encodeURIComponent(time)}`
                + `&amount=${encodeURIComponent(amount)}`;
        }

        if (status === "FAILED") {
            window.location.href =
                `/booking-result?success=false`
                + `&message=${encodeURIComponent("Thanh toán thất bại hoặc hết thời gian!")}`;
        }
    }, [status, open, courtName, date, time, amount]);

    // ====== COUNTDOWN ======
    useEffect(() => {
        if (!open) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setStatus("FAILED");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [open]);

    if (!open) return null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(txnRef).then(() => {
            alert("Đã copy mã giao dịch");
        });
    };

    const src = `data:image/png;base64,${qrBase64}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Quét QR để thanh toán</h3>
                    <button onClick={() => onClose({ cancelled: true })} className="text-gray-600">✕</button>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <div className="bg-gray-50 p-2 rounded">
                        <img
                            src={src}
                            alt="QR code"
                            style={{ width: 260, height: 260, objectFit: "contain" }}
                        />
                    </div>

                    <div className="text-center">
                        <div>
                            Mã giao dịch:
                            <code className="ml-1">{txnRef}</code>
                            <button
                                onClick={copyToClipboard}
                                className="ml-2 text-sm underline"
                            >
                                Copy
                            </button>
                        </div>

                        <div>
                            Số tiền:
                            <strong className="ml-1">
                                {Number(amount).toLocaleString()} VND
                            </strong>
                        </div>

                        <div className="mt-2">
                            Thời gian còn lại:
                            <strong className="ml-1">
                                {minutes}:{String(seconds).padStart(2, "0")}
                            </strong>
                        </div>
                    </div>

                    <div className="w-full mt-4">
                        {status === "WAITING" && (
                            <div className="p-3 bg-yellow-50 border rounded text-center">
                                Chờ thanh toán...
                            </div>
                        )}
                        {status === "PAID" && (
                            <div className="p-3 bg-green-50 border rounded text-center">
                                Thanh toán thành công! Đang chuyển hướng...
                            </div>
                        )}
                        {status === "FAILED" && (
                            <div className="p-3 bg-red-50 border rounded text-center">
                                Thanh toán thất bại hoặc hết thời gian. Đang chuyển hướng...
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 mt-3">
                        <a
                            href={src}
                            download={`qr-${txnRef}.png`}
                            className="px-4 py-2 border rounded"
                        >
                            Tải QR
                        </a>
                        <button
                            onClick={() => onClose({ cancelled: true })}
                            className="px-4 py-2 border rounded"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
