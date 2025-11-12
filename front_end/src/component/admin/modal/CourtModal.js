import React from "react";

const CourtsModal = ({ courts, fieldName, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg">
                <h3 className="text-2xl font-bold text-green-700 text-center mb-4">
                    🏟️ Danh sách sân
                </h3>
                <p className="text-center font-semibold text-gray-800 mb-6">
                    {fieldName}
                </p>

                <ul className="divide-y divide-gray-200">
                    {courts.length > 0 ? (
                        courts.map((court) => (
                            <li
                                key={court.id}
                                className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {court.courtName || court.name}
                                    </p>
                                    <p
                                        className={`text-sm ${
                                            court.status === "AVAILABLE"
                                                ? "text-green-600"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {court.status === "AVAILABLE"
                                            ? "Hoạt động"
                                            : "Bảo trì"}
                                    </p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">
                            Không có sân nào.
                        </p>
                    )}
                </ul>

                <button
                    onClick={onClose}
                    className="mt-6 w-full py-3 font-bold bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default CourtsModal;
