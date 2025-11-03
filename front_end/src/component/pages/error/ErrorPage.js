import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = ({ code, message }) => {
    return (

        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 p-6">
            <h1 className="text-9xl font-extrabold text-purple-700 mb-4">{code}</h1>
            <p className="text-2xl font-semibold text-gray-800 mb-6">{message}</p>
            <Link
                to="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Quay về trang chủ
            </Link>
        </div>
    );
};

export const NotFoundPage = () => (
    <ErrorPage code="404" message="Không tìm thấy trang này" />
);

export const ForbiddenPage = () => (
    <ErrorPage code="403" message="Bạn không có quyền truy cập" />
);
