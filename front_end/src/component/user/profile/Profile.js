import { useEffect, useRef, useState } from "react";
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    PencilIcon,
    CameraIcon,
    BriefcaseIcon,
    LockClosedIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Preloader from "../../../ui/Preloader";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getCurrentUser, updateUserProfile } from "../../../service/user/login/authApi";
import { useAuth } from "../../../service/user/context/authContext";

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        avatar: "",
        phone: "",
        email: "",
        address: "",
        softDelete: false,
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
                setFormData({
                    name: userData.name || "",
                    avatar: userData.avatar || "",
                    phone: userData.phone || "",
                    email: userData.email || "",
                    address: userData.address || "",
                    softDelete: userData.softDelete,
                });
            } catch (err) {
                toast.error("Không thể tải thông tin người dùng");
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setFormData((prev) => ({
                        ...prev,
                        avatarPreview: reader.result,
                        avatarFile: file,
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOpenFileDialog = () => fileInputRef.current.click();

    const handleSave = async (values, { setSubmitting }) => {
        try {
            const form = new FormData();
            form.append("name", values.name);
            form.append("phone", values.phone);
            form.append("address", values.address);

            // Nếu có chọn avatar mới thì append file
            if (formData.avatarFile) {
                form.append("avatar", formData.avatarFile);
            }

            const updatedUser = await updateUserProfile(form);

            if (updatedUser) {
                toast.success("Đã cập nhật thông tin");
                setFormData({
                    name: updatedUser.name || "",
                    avatar: updatedUser.avatar || "",
                    phone: updatedUser.phone || "",
                    email: updatedUser.email || "",
                    address: updatedUser.address || "",
                });
                setUser(updatedUser);
                setIsEditing(false);
            } else {
                toast.error("Cập nhật thất bại");
            }
        } catch (error) {
            toast.error(error.response?.data || "Có lỗi xảy ra khi cập nhật thông tin");
        } finally {
            setSubmitting(false);
        }
    };


    const handleCancel = () => {
        setFormData({
            name: user?.name || "",
            avatar: user?.avatar || "",
            phone: user?.phone || "",
            email: user?.email || "",
            address: user?.address || "",
            softDelete: user?.softDelete || false,
        });
        setIsEditing(false);
    };

    const profileValidation = Yup.object({
        name: Yup.string().required("Tên không được để trống"),
        phone: Yup.string()
            .required("Số điện thoại không được để trống")
            .matches(/^0[0-9]{9}$/, "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số"),
    });

    if (!user) return <Preloader />;

    return (
        <div className="bg-gray-50 py-8">
            <Formik
                enableReinitialize
                initialValues={formData}
                onSubmit={handleSave}
                validationSchema={profileValidation}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Header */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Hồ sơ cá nhân
                                    </h1>
                                    {!isEditing ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                            <span>Chỉnh sửa</span>
                                        </button>
                                    ) : (
                                        <div className="flex space-x-3">
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                            >
                                                {isSubmitting ? "Đang lưu..." : "Cập nhật"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Avatar */}
                                <div className="px-6 py-6 flex items-center space-x-6">
                                    <div className="relative">
                                        <img
                                            src={
                                                formData.avatarPreview
                                                    ? formData.avatarPreview
                                                    : formData.avatar
                                                        ? `http://localhost:8080${formData.avatar}`
                                                        : "/default-avatar.png"
                                            }
                                            alt="Avatar"
                                            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                                        />
                                        {isEditing && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={handleOpenFileDialog}
                                                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full"
                                                >
                                                    <CameraIcon className="w-4 h-4" />
                                                </button>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {formData.name}
                                        </h2>
                                        <p
                                            className={`font-medium ${
                                                formData.softDelete
                                                    ? "text-red-600"
                                                    : "text-green-600"
                                            }`}
                                        >
                                            {formData.softDelete ? "Bị khóa" : "Đang hoạt động"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <UserIcon className="w-4 h-4 inline mr-2" />
                                            Họ và tên
                                        </label>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                />
                                                <ErrorMessage
                                                    name="name"
                                                    component="div"
                                                    className="mt-1 text-sm text-red-600"
                                                />
                                            </>
                                        ) : (
                                            <p className="text-gray-900 py-2">{formData.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <PhoneIcon className="w-4 h-4 inline mr-2" />
                                            Số điện thoại
                                        </label>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                />
                                                <ErrorMessage
                                                    name="phone"
                                                    component="div"
                                                    className="mt-1 text-sm text-red-600"
                                                />
                                            </>
                                        ) : (
                                            <p className="text-gray-900 py-2">{formData.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <BriefcaseIcon className="w-4 h-4 inline mr-2" />
                                            Địa chỉ
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        ) : (
                                            <p className="text-gray-900 py-2">{formData.address}</p>
                                        )}
                                    </div>
                                </div>

                                {/* ✅ Button mở modal đổi mật khẩu */}
                                <div className="pt-4 border-t border-gray-200 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(true)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                                    >
                                        <LockClosedIcon className="w-4 h-4" />
                                        <span>Đổi mật khẩu</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>

            {/* Modal đổi mật khẩu */}
            {/*{showPasswordModal && (*/}
            {/*    <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />*/}
            {/*)}*/}
        </div>
    );
}
