import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerApi } from "../../service/login/authApi";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
    name: Yup.string()
        .trim()
        // .matches(/"^[A-ZĂÂÊÔĐƠƯ][a-zăâđêôơưỳýỷỹỵàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựìíỉĩị]*(\s[A-ZĂÂÊĐÔƠƯ][a-zăâđêôơưỳýỷỹỵàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựìíỉĩị]*)*$"/,
        //     "Tên tiếng Việt có thể có dấu.")
        .min(5, "Họ và tên phải có ít nhất 5 ký tự.")
        .required("Họ và tên không được để trống."),
    username: Yup.string()
        .trim()
        .matches(/^[a-z0-9]{4,20}$/, "Chỉ chấp nhận chữ thường, số, 4-20 ký tự.")
        .required("Tên đăng nhập không được để trống."),
    email: Yup.string()
        .trim()
        .matches(/^[A-Za-z0-9]+[A-Za-z0-9]*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)$/,"Email không đúng định dạng.")
        .email("Email không đúng định dạng.")
        .required("Email không được để trống."),
    password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
        .required("Mật khẩu không được để trống."),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp.")
        .required("Vui lòng xác nhận mật khẩu."),
    phone: Yup.string()
        .trim()
        .matches(/^(0[0-9]{9})$/, "SĐT phải bắt đầu bằng 0 và có 10 chữ số.")
        .required("Số điện thoại không được để trống."),
    address: Yup.string().nullable(),
});

export default function Register() {
    const navigate = useNavigate();
    const [preview, setPreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleFileChange = (e, setFieldValue) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Ảnh đại diện không được quá 5MB!");
                e.target.value = null;
                setFieldValue("avatar", null);
                setPreview(null);
                return;
            }
            setFieldValue("avatar", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const dataToSend = new FormData();
            dataToSend.append("name", values.name);
            dataToSend.append("username", values.username);
            dataToSend.append("email", values.email);
            dataToSend.append("password", values.password);
            dataToSend.append("phone", values.phone);
            dataToSend.append("address", values.address || "");
            if (values.avatar) {
                dataToSend.append("avatar", values.avatar);
            }
            await registerApi(dataToSend);
            toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực OTP.");
            navigate("/verify-otp", { state: { email: values.email } });
        } catch (err) {
            console.error("Lỗi đăng ký:", err);
            const errorMessage = err.response?.data?.message || "Đăng ký thất bại!";
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-500 p-4">
            <div className="bg-gray-100 p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-lg border border-gray-200">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
                    Đăng ký tài khoản
                </h2>
                <Formik
                    initialValues={{
                        name: "",
                        username: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        phone: "",
                        address: "",
                        avatar: null,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form className="space-y-5">
                            {/* Hàng 1: Họ tên và Tên đăng nhập */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Họ và tên <span className="text-red-600">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                        placeholder="Nguyễn Văn A"
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Tên đăng nhập <span className="text-red-600">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        id="username"
                                        name="username"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                        placeholder="4-20 ký tự, không dấu"
                                    />
                                    <ErrorMessage
                                        name="username"
                                        component="div"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>
                            </div>
                            {/* Hàng 2: Email và Số điện thoại */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Email <span className="text-red-600">*</span>
                                    </label>
                                    <Field
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                        placeholder="example@gmail.com"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Số điện thoại <span className="text-red-600">*</span>
                                    </label>
                                    <Field
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                        placeholder="0901234567"
                                    />
                                    <ErrorMessage
                                        name="phone"
                                        component="div"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>
                            </div>
                            {/* Hàng 3: Mật khẩu, Xác nhận mật khẩu và Địa chỉ */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Mật khẩu <span className="text-red-600">*</span>
                                    </label>
                                    <div className="relative">
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 pr-10"
                                            placeholder="Ít nhất 6 ký tự"
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer hover:text-blue-600 transition"
                                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                        >
                      {showPassword ? (
                          <FaEyeSlash className="w-5 h-5" />
                      ) : (
                          <FaEye className="w-5 h-5" />
                      )}
                    </span>
                                    </div>
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Xác nhận mật khẩu <span className="text-red-600">*</span>
                                    </label>
                                    <div className="relative">
                                        <Field
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 pr-10"
                                            placeholder="Nhập lại mật khẩu"
                                        />
                                        <span
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer hover:text-blue-600 transition"
                                            aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                        >
                      {showConfirmPassword ? (
                          <FaEyeSlash className="w-5 h-5" />
                      ) : (
                          <FaEye className="w-5 h-5" />
                      )}
                    </span>
                                    </div>
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="div"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>
                            </div>
                            {/* Địa chỉ */}
                            <div>
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Địa chỉ (Không bắt buộc)
                                </label>
                                <Field
                                    type="text"
                                    id="address"
                                    name="address"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                    placeholder="Số nhà, đường, quận/huyện..."
                                />
                                <ErrorMessage
                                    name="address"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>
                            {/* Khu vực Tải ảnh đại diện */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ảnh đại diện (Không bắt buộc)
                                </label>
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Ảnh xem trước"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaUserCircle className="w-10 h-10 text-gray-500" />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, setFieldValue)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2.5 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-xl focus:ring-4 focus:ring-blue-300 focus:outline-none mt-6"
                            >
                                ĐĂNG KÝ
                            </button>
                        </Form>
                    )}
                </Formik>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Đã có tài khoản?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition"
                    >
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}


// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { registerApi } from "../../service/login/authApi";
// // Import icons
// import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa"; // Thêm icon cho mật khẩu và avatar
//
// export default function Register() {
//     const navigate = useNavigate();
//     const [validationErrors, setValidationErrors] = useState({});
//     const [formData, setFormData] = useState({
//         name: "",
//         username: "",
//         email: "",
//         password: "",
//         phone: "",
//         address: "",
//         avatar: null,
//     });
//     const [preview, setPreview] = useState(null);
//     const [showPassword, setShowPassword] = useState(false); // State ẩn/hiện mật khẩu
//
//     // const handleChange = (e) => {
//     //     const { name, value } = e.target;
//     //     setFormData((prev) => ({
//     //         ...prev,
//     //         [name]: value,
//     //     }));
//     // };
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//         // Xóa lỗi ngay khi người dùng bắt đầu gõ lại
//         setValidationErrors((prev) => ({
//             ...prev,
//             [name]: null,
//         }));
//     };
//
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Giới hạn kích thước file (ví dụ: 5MB)
//             if (file.size > 5 * 1024 * 1024) {
//                 toast.error("Ảnh đại diện không được quá 5MB!");
//                 e.target.value = null; // Xóa file đã chọn
//                 setFormData((prev) => ({ ...prev, avatar: null }));
//                 setPreview(null);
//                 return;
//             }
//             setFormData((prev) => ({
//                 ...prev,
//                 avatar: file,
//             }));
//             setPreview(URL.createObjectURL(file));
//         }
//     };
//
//     const handleRegister = async (e) => {
//         e.preventDefault();
//
//         // Thêm validation cơ bản trước khi gọi API
//         if (formData.password.length < 6) {
//             toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
//             return;
//         }
//
//         try {
//             const dataToSend = new FormData();
//             dataToSend.append("name", formData.name);
//             dataToSend.append("username", formData.username);
//             dataToSend.append("email", formData.email);
//             dataToSend.append("password", formData.password);
//             dataToSend.append("phone", formData.phone);
//             dataToSend.append("address", formData.address);
//             if (formData.avatar) {
//                 dataToSend.append("avatar", formData.avatar);
//             }
//
//             await registerApi(dataToSend);
//             toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực OTP.");
//             // Chuyển sang trang xác thực OTP + truyền email đăng ký
//             navigate("/verify-otp", { state: { email: formData.email } });
//         } catch (err) {
//             console.error(" Lỗi đăng ký:", err);
//             const errorMessage = err.response?.data?.message || "Đăng ký thất bại!";
//             toast.error(errorMessage);
//         }
//     };
//
//     const validateForm = () => {
//         const errors = {};
//         const { name, username, email, password, phone } = formData;
//
//         // 1. Name: Chỉ chấp nhận chữ cái, tối thiểu 2 từ (có khoảng trắng)
//         if (!name.trim()) {
//             errors.name = "Họ và tên không được để trống.";
//         } else if (name.trim().length < 5) {
//             errors.name = "Họ và tên phải có ít nhất 5 ký tự.";
//         }
//
//         // 2. Username: Regex (a-z, 0-9, 4-20 ký tự)
//         const usernameRegex = /^[a-z0-9]{4,20}$/;
//         if (!username.trim()) {
//             errors.username = "Tên đăng nhập không được để trống.";
//         } else if (!usernameRegex.test(username)) {
//             errors.username = "Chỉ chấp nhận chữ thường, số, 4-20 ký tự.";
//         }
//
//         // 3. Email: Định dạng email hợp lệ
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!email.trim()) {
//             errors.email = "Email không được để trống.";
//         } else if (!emailRegex.test(email)) {
//             errors.email = "Email không đúng định dạng.";
//         }
//
//         // 4. Password: Tối thiểu 6 ký tự
//         if (!password) {
//             errors.password = "Mật khẩu không được để trống.";
//         } else if (password.length < 6) {
//             errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
//         }
//
//         // 5. Phone: Regex (Bắt đầu bằng 0, 10 chữ số)
//         const phoneRegex = /^(0[0-9]{9})$/;
//         if (phone.trim() && !phoneRegex.test(phone)) { // Kiểm tra nếu có nhập thì validate
//             errors.phone = "SĐT phải bắt đầu bằng 0 và có 10 chữ số.";
//         } else if (!phone.trim()) {
//             errors.phone = "Số điện thoại không được để trống.";
//         }
//
//         setValidationErrors(errors);
//         // Trả về true nếu không có lỗi nào
//         return Object.keys(errors).length === 0;
//     };
//
//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-500 p-4">
//             {/* Form Container - Tăng chiều rộng để chứa nhiều trường hơn */}
//             <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-lg border border-gray-200">
//                 <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
//                     Đăng ký tài khoản
//                 </h2>
//                 <form onSubmit={handleRegister} className="space-y-5">
//
//                     {/* Hàng 1: Họ tên và Tên đăng nhập */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-600">*</span> </label>
//                             <input
//                                 type="text"
//                                 id="name"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 required
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
//                                 placeholder="Nguyễn Văn A"
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập <span className="text-red-600">*</span></label>
//                             <input
//                                 type="text"
//                                 id="username"
//                                 name="username"
//                                 value={formData.username}
//                                 onChange={handleChange}
//                                 pattern="^[a-z0-9]{4,20}$"
//                                 required
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
//                                 placeholder="4-20 ký tự, không dấu"
//                                 title="Tên đăng nhập phải là chữ thường, không dấu, 4-20 ký tự."
//                             />
//                         </div>
//                     </div>
//
//                     {/* Hàng 2: Email và Số điện thoại */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-600">*</span></label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 required
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
//                                 placeholder="example@gmail.com"
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-600">*</span></label>
//                             <input
//                                 type="tel"
//                                 id="phone"
//                                 name="phone"
//                                 value={formData.phone}
//                                 onChange={handleChange}
//                                 pattern="^(0[0-9]{9})$"
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
//                                 placeholder="0901234567"
//                                 title="Số điện thoại bắt đầu bằng 0 và có 10 chữ số."
//                             />
//                         </div>
//                     </div>
//
//                     {/* Hàng 3: Mật khẩu và Địa chỉ */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu <span className="text-red-600">*</span></label>
//                             <div className="relative">
//                                 <input
//                                     type={showPassword ? "text" : "password"}
//                                     id="password"
//                                     name="password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     required
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 pr-10"
//                                     placeholder="Ít nhất 6 ký tự"
//                                 />
//                                 <span
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer hover:text-blue-600 transition"
//                                     aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
//                                 >
//                                     {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
//                                 </span>
//                             </div>
//                         </div>
//                         <div>
//                             <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ (Không bắt buộc)</label>
//                             <input
//                                 type="text"
//                                 id="address"
//                                 name="address"
//                                 value={formData.address}
//                                 onChange={handleChange}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
//                                 placeholder="Số nhà, đường, quận/huyện..."
//                             />
//                         </div>
//                     </div>
//
//                     {/* Khu vực Tải ảnh đại diện */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện (Không bắt buộc)</label>
//                         <div className="flex items-center space-x-4">
//                             {/* Vòng tròn xem trước avatar */}
//                             <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
//                                 {preview ? (
//                                     <img
//                                         src={preview}
//                                         alt="Ảnh xem trước"
//                                         className="w-full h-full object-cover"
//                                     />
//                                 ) : (
//                                     <FaUserCircle className="w-10 h-10 text-gray-500" />
//                                 )}
//                             </div>
//                             {/* Input file */}
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleFileChange}
//                                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
//                             />
//                         </div>
//                     </div>
//
//
//                     <button
//                         type="submit"
//                         className="w-full py-2.5 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-xl focus:ring-4 focus:ring-blue-300 focus:outline-none mt-6"
//                     >
//                         ĐĂNG KÝ
//                     </button>
//                 </form>
//
//                 <p className="mt-6 text-center text-sm text-gray-600">
//                     Đã có tài khoản?{" "}
//                     <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition">
//                         Đăng nhập
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }