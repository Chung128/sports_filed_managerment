import { useState } from "react";
import toast from "react-hot-toast";

export default function ChangePasswordModal({ onClose }) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            setLoading(true);
          //  await changePassword({ oldPassword, newPassword });
            toast.success("Đổi mật khẩu thành công");
            onClose();
        } catch (err) {
            toast.error(err.response?.data || "Đổi mật khẩu thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Đổi mật khẩu</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Mật khẩu cũ</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Mật khẩu mới</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {loading ? "Đang xử lý..." : "Xác nhận"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
