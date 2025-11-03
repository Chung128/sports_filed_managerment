// src/pages/BookingResultPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PaymentResultModal from "../modal/PaymentResultModal";


export default function BookingResultPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(true);

    const result = {
        success: searchParams.get("success") === "true",
        message: decodeURIComponent(searchParams.get("message") || ""),
        courtName: decodeURIComponent(searchParams.get("courtName") || ""),
        date: searchParams.get("date") || "",
        time: decodeURIComponent(searchParams.get("time") || ""),
        amount: searchParams.get("amount") || "0",
    };

    const handleClose = () => {
        setShowModal(false);
        setTimeout(() => {
            navigate("/booking"); // Quay lại trang đặt sân
        }, 300);
    };

    return <PaymentResultModal isOpen={showModal} onClose={handleClose} result={result} />;
}