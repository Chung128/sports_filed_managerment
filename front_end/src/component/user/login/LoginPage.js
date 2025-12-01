// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { loginApi } from "../../service/login/authApi";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
//
// // Validation schema using Yup (chỉ username và password)
// const validationSchema = Yup.object({
//     username: Yup.string()
//         .trim()
//        // .matches(/^[a-z0-9]{4,20}$/, "Chỉ chấp nhận chữ thường, số, 4-20 ký tự.")
//         .required("Tên đăng nhập không được để trống."),
//     password: Yup.string()
//         .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
//         .required("Mật khẩu không được để trống."),
// });
//
// export default function Login() {
//     const navigate = useNavigate();
//     const [showPassword, setShowPassword] = useState(false);
//
//     const handleSubmit = async (values, { setSubmitting }) => {
//         try {
//             const res = await loginApi(values.username, values.password);
//             const token = res?.data?.token;
//
//             if (token) {
//                 localStorage.setItem("token", token);
//                 const loggedUser = { username: values.username };
//                 localStorage.setItem("user", JSON.stringify(loggedUser));
//                 toast.success("Đăng nhập thành công!");
//                 navigate("/");
//             } else {
//                 toast.error("Lỗi: Không nhận được Token từ máy chủ!");
//             }
//         } catch (err) {
//             console.error("Lỗi đăng nhập:", err);
//             const errorMessage = err.response?.data?.message || "Sai tên đăng nhập hoặc mật khẩu!";
//             toast.error(errorMessage);
//         } finally {
//             setSubmitting(false);
//         }
//     };
//
//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-500 p-4">
//             <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-sm border border-gray-200">
//                 <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
//                     Đăng nhập
//                 </h2>
//                 <Formik
//                     initialValues={{
//                         username: "",
//                         password: "",
//                     }}
//                     validationSchema={validationSchema}
//                     onSubmit={handleSubmit}
//                 >
//                     {({ isSubmitting }) => (
//                         <Form className="space-y-6">
//                             {/* Trường Tên đăng nhập */}
//                             <div>
//                                 <label
//                                     htmlFor="username"
//                                     className="block text-sm font-medium text-gray-700 mb-1"
//                                 >
//                                     Nhập tài khoản
//                                 </label>
//                                 <Field
//                                     type="text"
//                                     id="username"
//                                     name="username"
//                                     placeholder="Tên đăng nhập"
//                                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
//                                 />
//                                 <ErrorMessage
//                                     name="username"
//                                     component="div"
//                                     className="text-red-600 text-sm mt-1"
//                                 />
//                             </div>
//
//                             {/* Trường Mật khẩu */}
//                             <div>
//                                 <label
//                                     htmlFor="password"
//                                     className="block text-sm font-medium text-gray-700 mb-1"
//                                 >
//                                     Nhập mật khẩu
//                                 </label>
//                                 <div className="relative">
//                                     <Field
//                                         type={showPassword ? "text" : "password"}
//                                         id="password"
//                                         name="password"
//                                         placeholder="Mật khẩu"
//                                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 pr-10"
//                                     />
//                                     <span
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer hover:text-blue-600 transition"
//                                         aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
//                                     >
//                     {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
//                   </span>
//                                 </div>
//                                 <ErrorMessage
//                                     name="password"
//                                     component="div"
//                                     className="text-red-600 text-sm mt-1"
//                                 />
//                             </div>
//
//                             {/* Nút Đăng nhập */}
//                             <button
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none"
//                             >
//                                 Đăng nhập
//                             </button>
//                         </Form>
//                     )}
//                 </Formik>
//
//                 {/* Liên kết Đăng ký (sử dụng Link từ react-router-dom để tránh reload trang) */}
//                 <p className="mt-6 text-center text-sm text-gray-600">
//                     Bạn chưa có tài khoản?{" "}
//                     <Link
//                         to="/register"
//                         className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition"
//                     >
//                         Đăng ký ngay
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }
//
//
//
// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import toast from "react-hot-toast";
// // import { loginApi } from "../../service/login/authApi";
// // // Import icons từ react-icons
// // import { FaEye, FaEyeSlash } from "react-icons/fa";
// //
// // export default function Login() {
// //     const navigate = useNavigate();
// //     const [showPassword, setShowPassword] = useState(false); // State để ẩn/hiện mật khẩu
// //
// //     const handleLogin = async (e) => {
// //         e.preventDefault();
// //         const username = e.target.username.value;
// //         const password = e.target.password.value;
// //
// //         // Kiểm tra trống (có thể bỏ qua nếu đã dùng required trong input)
// //         if (!username || !password) {
// //             toast.error("Vui lòng nhập đầy đủ Tài khoản và Mật khẩu!");
// //             return;
// //         }
// //
// //         try {
// //             const res = await loginApi(username, password);
// //             const token = res?.data?.token;
// //
// //             if (token) {
// //                 // Giả định logic lưu user và token là chính xác
// //                 localStorage.setItem("token", token);
// //                 const loggedUser = { username };
// //                 // Lưu user data vào localStorage để Navbar có thể đọc
// //                 localStorage.setItem("user", JSON.stringify(loggedUser));
// //                 toast.success("Đăng nhập thành công!");
// //                 navigate("/");
// //             } else {
// //                 toast.error("Lỗi: Không nhận được Token từ máy chủ!");
// //             }
// //         } catch (err) {
// //             console.error("Lỗi đăng nhập:", err);
// //             // Sử dụng thông báo lỗi cụ thể từ server nếu có
// //             const errorMessage = err.response?.data?.message || "Sai tên đăng nhập hoặc mật khẩu!";
// //             toast.error(errorMessage);
// //         }
// //     };
// //
// //     return (
// //         // Sử dụng Tailwind CSS để tạo giao diện căn giữa, nền nhẹ và form nổi bật
// //         <div className="flex justify-center items-center min-h-screen bg-gray-500 p-4">
// //             {/* Form Container - Nổi bật hơn */}
// //             <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-sm border border-gray-200">
// //                 <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
// //                     Đăng nhập
// //                 </h2>
// //                 <form onSubmit={handleLogin} className="space-y-6">
// //                     {/* Trường Tên đăng nhập */}
// //                     <div>
// //                         <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
// //                             Nhập tài khoản
// //                         </label>
// //                         <input
// //                             type="text"
// //                             id="username"
// //                             name="username"
// //                             placeholder="Tên đăng nhập"
// //                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
// //                             required
// //                         />
// //                     </div>
// //
// //                     {/* Trường Mật khẩu với chức năng ẩn/hiện */}
// //                     <div>
// //                         <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
// //                             Nhập mật khẩu
// //                         </label>
// //                         <div className="relative">
// //                             <input
// //                                 type={showPassword ? "text" : "password"}
// //                                 id="password"
// //                                 name="password"
// //                                 placeholder="Mật khẩu"
// //                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 pr-10" // pr-10 để chừa chỗ cho icon
// //                                 required
// //                             />
// //                             {/* Icon ẩn/hiện mật khẩu */}
// //                             <span
// //                                 onClick={() => setShowPassword(!showPassword)}
// //                                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer hover:text-blue-600 transition"
// //                                 aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
// //                             >
// //                                 {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
// //                             </span>
// //                         </div>
// //                     </div>
// //
// //                     {/* Quên mật khẩu */}
// //                     {/*<div className="text-sm text-right">*/}
// //                     {/*    <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition">*/}
// //                     {/*        Quên mật khẩu?*/}
// //                     {/*    </a>*/}
// //                     {/*</div>*/}
// //
// //                     {/* Nút Đăng nhập */}
// //                     <button
// //                         type="submit"
// //                         className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none"
// //                     >
// //                         Đăng nhập
// //                     </button>
// //                 </form>
// //
// //                 {/* Liên kết Đăng ký */}
// //                 <p className="mt-6 text-center text-sm text-gray-600">
// //                     Bạn chưa có tài khoản?{" "}
// //                     <a href="/register" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition">
// //                         Đăng ký ngay
// //                     </a>
// //                 </p>
// //             </div>
// //         </div>
// //     );
// // }

import { useState } from "react";
// Giữ nguyên các import của React Router và hot-toast
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {FaEye, FaEyeSlash, FaFacebook} from "react-icons/fa";
import {FcGoogle} from "react-icons/fc";
import {jwtDecode} from "jwt-decode";
import {googleLoginApi, loginApi} from "../../../service/user/login/authApi";
import { GoogleLogin } from "@react-oauth/google";


// Validation schema (GIỮ NGUYÊN LOGIC CỦA BẠN)
const validationSchema = Yup.object({
    username: Yup.string().trim().required("Tên đăng nhập không được để trống."),
    password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
        .required("Mật khẩu không được để trống."),
});

export default function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const res = await loginApi(values.username, values.password);
            const token = res?.data?.token;

            if (token) {
                const decoded = jwtDecode(token);
                console.log("📦 Token payload:", decoded);

                const username = decoded?.sub || "unknown";
                const role = decoded?.role || "USER";

                // Lưu vào localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify({ username, role }));

                toast.success("Đăng nhập thành công!");
                navigate("/");
            } else {
                toast.error("Không nhận được token từ máy chủ!");
            }
        } catch (err) {
            console.error("Login Error:", err);
            toast.error(err.response?.data?.message || "Sai tên đăng nhập hoặc mật khẩu!");
        } finally {
            setSubmitting(false);
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-300 p-4 sm:p-6 lg:p-12">
            {/* Card bao toàn bộ giao diện */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl">
                <div className="flex flex-col lg:flex-row min-h-[550px]">
                    {/* Cột trái - Visual Side (Dùng ảnh thật) */}
                    <div
                        className="hidden lg:flex lg:w-6/12 relative items-center justify-center bg-cover bg-center"
                        style={{
                            backgroundImage: "url('https://i.pinimg.com/1200x/0f/d9/70/0fd9709d7d14ca35699ecec804baae3d.jpg')",
                        }}
                    >
                        {/* Overlay mờ để dễ đọc chữ */}
                        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                        <div className="relative z-10 text-center text-white px-6">
                            {/* Logo (ảnh thật thay cho SVG) */}
                            {/*<div className="mx-auto mb-6 w-28 h-28 rounded-full shadow-lg overflow-hidden bg-white">*/}
                            {/*    <img*/}
                            {/*        src="https://pickleballvna.s3.ap-southeast-1.amazonaws.com/pickleballvna/clubs/logos/01JA54DJXEECEF6S8PRKGQMNTC.jpg" // 👉 Thay logo thật của bạn ở đây*/}
                            {/*        alt="Logo"*/}
                            {/*        className="w-full h-full object-cover"*/}
                            {/*    />*/}
                            {/*</div>*/}

                            <h2 className="text-3xl font-extrabold mb-3 tracking-wide drop-shadow-lg">
                                Chào mừng trở lại!
                            </h2>
                            <p className="text-base opacity-95 text-gray-100 drop-shadow-md">
                                Đăng nhập để tiếp tục quản lý tài khoản và trải nghiệm dịch vụ tốt nhất.
                            </p>
                        </div>
                    </div>


                    {/* Cột phải - Form đăng nhập */}
                    <div className="w-full lg:w-6/12 flex items-center justify-center bg-gray-200 p-8 sm:p-12 md:p-16 relative">

                        {/* Decoration Corner (Xanh Lá) */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100 opacity-50 rounded-bl-full translate-x-1/2 -translate-y-1/2"></div>

                        <div className="w-full max-w-md z-10">
                            <h1 className="text-4xl  font-black text-gray-900 text-center mb-4">
                                Đăng Nhập
                            </h1>
                            <br></br>
                            {/*<p className="text-center text-gray-500 mb-8 text-sm">*/}
                            {/*    Vui lòng điền thông tin chi tiết của bạn.*/}
                            {/*</p>*/}

                            <Formik
                                initialValues={{ username: "", password: "" }}
                                 validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="space-y-6">
                                        {/* Username */}
                                        <div>
                                            <label
                                                htmlFor="username"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Tên đăng nhập
                                            </label>
                                            <Field
                                                type="text"
                                                id="username"
                                                name="username"
                                                placeholder="Nhập tên đăng nhập"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50
                                                    focus:ring-teal-500 focus:border-teal-500 transition shadow-sm hover:border-teal-400"
                                            />
                                            <ErrorMessage
                                                name="username"
                                                component="div"
                                                className="text-red-500 text-xs mt-1 font-medium"
                                            />
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Mật khẩu
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    type={showPassword ? "text" : "password"}
                                                    id="password"
                                                    name="password"
                                                    placeholder="Nhập mật khẩu"
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50
                                                     focus:ring-teal-500 focus:border-teal-500 pr-10 transition shadow-sm hover:border-teal-400"
                                                />
                                                <span
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer hover:text-teal-600 transition"
                                                >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </span>
                                            </div>
                                            <ErrorMessage
                                                name="password"
                                                component="div"
                                                className="text-red-500 text-xs mt-1 font-medium"
                                            />
                                        </div>

                                        {/* Forgot Password Link */}
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                                    Ghi nhớ
                                                </label>
                                            </div>
                                            <Link
                                                to="/forgot-password"
                                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
                                            >
                                                Quên mật khẩu?
                                            </Link>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full py-3 text-white font-bold rounded-xl transition duration-300 shadow-lg 
                                                 ${isSubmitting
                                                ? 'bg-blue-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl focus:ring-4 focus:ring-teal-300'
                                            }`}
                                        >
                                            {isSubmitting ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
                                        </button>

                                        {/* Social Login (Optional enhancement for UX) */}
                                        <div className="text-center my-4">
                                            <span className="text-gray-400 text-sm">hoặc đăng nhập bằng</span>
                                        </div>
                                        <div className="flex space-x-4">
                                            <div className="flex space-x-4">

                                                {/* GOOGLE LOGIN */}
                                                <div className="flex-1">
                                                    <GoogleLogin
                                                        onSuccess={async (credentialResponse) => {
                                                            try {
                                                                const googleToken = credentialResponse.credential; // Google ID Token

                                                                const res = await googleLoginApi(googleToken);

                                                                const token = res?.data?.token;

                                                                if (token) {
                                                                    const decoded = jwtDecode(token);

                                                                    localStorage.setItem("token", token);
                                                                    localStorage.setItem(
                                                                        "user",
                                                                        JSON.stringify({
                                                                            username: decoded?.sub || decoded?.email,
                                                                            role: decoded?.role || "USER",
                                                                        })
                                                                    );

                                                                    toast.success("Đăng nhập Google thành công!");
                                                                    navigate("/");
                                                                }
                                                            } catch (error) {
                                                                console.error("Google Login BE Error:", error);
                                                                toast.error("Đăng nhập Google thất bại!");
                                                            }
                                                        }}
                                                        onError={() => {
                                                            toast.error("Google không xác thực được. Vui lòng thử lại!");
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="flex-1 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm flex items-center justify-center space-x-2"
                                            >
                                                <FaFacebook className="text-blue-600 text-xl" />
                                                <span className="text-gray-700 font-medium">Facebook</span>
                                            </button>
                                        </div>

                                        {/* Register Link */}
                                        <p className="text-center text-gray-600 text-sm mt-8">
                                            Bạn chưa có tài khoản?{" "}
                                            <Link
                                                to="/register"
                                                className="text-blue-600 hover:underline font-bold transition"
                                            >
                                                Đăng ký ngay
                                            </Link>
                                        </p>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
