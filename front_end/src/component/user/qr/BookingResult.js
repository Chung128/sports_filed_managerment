import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * This page expects query params from BE redirect or from QR flow.
 * Example: /booking-result?success=true&message=...&txnRef=...&courtName=...&date=2025-11-14&time=08:00-09:00&amount=200000
 */
export default function BookingResult() {
    const [searchParams] = useSearchParams();
    const [info, setInfo] = useState(null);

    useEffect(() => {
        const obj = {};
        for (const [k, v] of searchParams.entries()) obj[k] = v;
        setInfo(obj);
    }, [searchParams]);

    if (!info) return null;

    return (
        <div className="max-w-xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Kết quả thanh toán</h2>

            <div className="p-4 border rounded bg-white">
                <div><strong>Trạng thái:</strong> {info.success === "true" ? "Thành công" : "Thất bại / Hủy"}</div>
                <div><strong>Thông báo:</strong> {info.message}</div>
                <div><strong>TxnRef:</strong> {info.txnRef}</div>
                <div><strong>Sân:</strong> {info.courtName || "-"}</div>
                <div><strong>Ngày:</strong> {info.date || "-"}</div>
                <div><strong>Thời gian:</strong> {info.time || "-"}</div>
                <div><strong>Số tiền:</strong> {info.amount ? Number(info.amount).toLocaleString() + " VND" : "-"}</div>
            </div>
        </div>
    );
}
