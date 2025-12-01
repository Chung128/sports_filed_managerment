// import './App.css';
// import {Routes,
//     Route,
//     useLocation,
//     Navigate,} from "react-router-dom";
//
// import {useEffect} from "react";
// import SitemapPage from "./component/pages/layout/MapPage";
// import Home from "./component/pages/Home";
// import {Toaster} from "react-hot-toast";
// import Navbar from "./component/pages/layout/Navbar";
// import Footer from "./component/pages/layout/Footer";
// import AboutUs from "./component/pages/AboutUs";
// import Login from "./component/login/LoginPage";
// import Register from "./component/login/Register";
// import Profile from "./component/user/Profile";
// import {AuthProvider} from "./service/context/authContext";
// import VerifyOtp from "./component/login/VerifyOtp";
// import BookingPage from "./component/booking/BookingPage";
// import BookingFormPage from "./component/booking/BookingFormPage";
// import BookingResultPage from "./component/booking/BookingResultPage";
//
// // Component để scroll to top khi navigate
// const ScrollToTop = () => {
//     const location = useLocation();
//
//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, [location.pathname]);
//
//     return null;
// };
//
// // Component để xác định có hiển thị Navbar/Footer không
// const AppLayout = ({children}) => {
//     const location = useLocation();
//     const isAuthPage = [
//         "/login",
//         "/register",
//         "/reset-password",
//         "/forgot-password",
//         "/verification"
//     ].includes(location.pathname);
//
//     const isAdminPage = location.pathname.startsWith("/admin");
//     const isLegalPage = ["/terms", "/privacy"].includes(location.pathname);
//
//     const isErrorPage = ["/not-found"].includes(location.pathname);
//     // Hiển thị Navbar ở tất cả pages trừ auth pages, admin pages và legal pages
//     const shouldShowNavbar =
//         !isAuthPage && !isAdminPage && !isLegalPage && !isErrorPage;
//
//     // Hiển thị Footer ở tất cả pages trừ auth pages và admin pages (bao gồm cả legal pages)
//    // const shouldShowFooter = !Profile && !isAdminPage && !isErrorPage;
//
//
//     // Chỉ hiển thị Footer trên trang Home ("/") và About Us ("/about").
//     const shouldShowFooter = ["/", "/about"].includes(location.pathname);
//
//
//     return (
//         <div className="min-h-screen flex flex-col">
//           {shouldShowNavbar && <Navbar />}
//           <main className="flex-1">{children}</main>
//           {shouldShowFooter && <Footer />}
//         </div>
//     );
// };
//
// // AppLayout.propTypes = {
// //     children: PropTypes.node.isRequired,
// // };
//
// function App() {
//     return (<>
//             <ScrollToTop/>
//             <Routes>
//                 <Route
//                     path="/*"
//                     element={
//                         <AppLayout>
//                             <Routes>
//                                 <Route path="/" element={<Home/>}/>
//                                 <Route path="/about" element={<AboutUs />} />
//                                 <Route path="/booking" element={<BookingPage />} />
//                                 <Route path="/booking/:variantId" element={<BookingFormPage />} />
//                                 <Route path="/booking-result" element={<BookingResultPage />} />
//                                 {/*<Route path="/guide" element={<GuidePage />} />*/}
//                                 <Route path="/sitemap" element={<SitemapPage/>}/>
//                                 <Route path="/login" element={<Login/>
//                                       // <GuestRoute>
//                                       //   <LoginPage />
//                                       // </GuestRoute>
//                                     }/>
//                                 <Route
//                                     path="/register"
//                                     element={
//                                     <Register/>
//                                       // <GuestRoute>
//                                       //   <RegisterPage />
//                                       // </GuestRoute>
//                                     }/>
//                                 <Route path="/verify-otp" element={<VerifyOtp />} />
//                                 <Route
//                                     path="/profile"
//                                     element={
//                                       <AuthProvider>
//                                         <Profile />
//                                       </AuthProvider>
//                                     }
//                                 />
//                             </Routes>
//                         </AppLayout>}
//                 />
//             </Routes>
//             <Toaster
//                 position="top-right"
//                 toastOptions={{
//                     duration: 2500,
//                     style: {
//                         background: "#363636",
//                         color: "#fff",
//                         zIndex: 999999,
//                     },
//                     success: {
//                         duration: 2500,
//                         style: {
//                             background: "#10B981",
//                             color: "#fff",
//                             zIndex: 999999,
//                         },
//                     },
//                     error: {
//                         duration: 2500,
//                         style: {
//                             background: "#EF4444",
//                             color: "#fff",
//                             zIndex: 999999,
//                         },
//                     },
//                 }}
//             />
//         </>
//     );
// }
//
// export default App;
import './App.css';
import {Routes, Route, useLocation} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import { useEffect, useState } from "react";           // Thêm dòng này

// --- User pages ---
import Navbar from "./component/pages/layout/Navbar";
import Footer from "./component/pages/layout/Footer";
import Home from "./component/pages/Home";
import AboutUs from "./component/pages/AboutUs";
import Profile from "./component/user/profile/Profile";
import {AuthProvider} from "./service/user/context/authContext";

// --- Admin pages ---
import {AppSidebar} from "./component/admin/layout/AppSidebar";
import Dashboard from "./component/admin/pages/Dashboard";
import Bookings from "./component/admin/pages/Bookings";
import Fields from "./component/admin/pages/Fields";
import Users from "./component/admin/pages/Users";
import Schedule from "./component/admin/pages/Schedule";
import BookingFormPage from "./component/user/booking/BookingFormPage";
import BookingResultPage from "./component/user/booking/BookingResultPage";
import SitemapPage from "./component/pages/layout/MapPage";
import BookingPage from "./component/user/booking/BookingPage";
import Register from "./component/user/login/Register";
import VerifyOtp from "./component/user/login/VerifyOtp";
import LoginPage from "./component/user/login/LoginPage";
import {NotFoundPage} from "./component/pages/error/ErrorPage";
import UserBookingHistory from "./component/user/profile/UserBookingHistory";
import BookingResult from "./component/user/qr/BookingResult";
import QrPaymentPage from "./component/user/qr/BookingForm";
import {GoogleOAuthProvider} from "@react-oauth/google";
import ChatWidget from "./component/chat/user/ChatWidget";
import AdminDashboard from "./component/chat/admin/AdminDashboard";
//import NotFound from "./component/admin/pages/NotFound";

// Scroll to top khi đổi route
const ScrollToTop = () => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);
    return null;
};

// Layout cho user
const AppLayout = ({children}) => {
    const location = useLocation();
    const isAuthPage = [
        "/login",
        "/register",
        "/reset-password",
        "/forgot-password",
        "/verification",
    ].includes(location.pathname);

    const isAdminPage = location.pathname.startsWith("/admin");
    const isErrorPage = ["/not-found"].includes(location.pathname);
    const isLegalPage = ["/terms", "/privacy"].includes(location.pathname);

    const shouldShowNavbar =
        !isAuthPage && !isAdminPage && !isLegalPage && !isErrorPage;

    const shouldShowFooter = ["/", "/about"].includes(location.pathname);

    return (
        <div className="min-h-screen flex flex-col">
            {shouldShowNavbar && <Navbar/>}
            <main className="flex-1">{children}</main>
            {shouldShowFooter && <Footer/>}
        </div>
    );
};
const UserLayout=()=>{
    return(
        <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">

        </div>
    )
}

// const AdminLayout = () => {
//     const [currentAdmin, setCurrentAdmin] = useState(null);
//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         if (!token) return;
//
//         try {
//             const payload = JSON.parse(atob(token.split('.')[1]));
//             console.log("JWT Payload:", payload); // Xem thật
//
//             // FIX: ID của bạn nằm ở "sub" hoặc "userId", không phải "id"
//             const adminId = payload.sub || payload.userId || payload.id;
//
//             // Nếu vẫn là chuỗi "admin" → lỗi nghiêm trọng
//             if (!adminId || adminId === "admin") {
//                 console.error("Token không chứa ID số! Payload:", payload);
//                 return;
//             }
//
//             // Ép kiểu sang Number nếu là chuỗi số
//             const id = typeof adminId === "string" ? parseInt(adminId) : adminId;
//
//             setCurrentAdmin({
//                 id: id,  // ← BẮT BUỘC PHẢI LÀ SỐ (VD: 4)
//                 name: payload.name || payload.username || payload.email || "Admin",
//                 role: payload.role || "ADMIN",
//                 avatar: payload.avatar || null
//             });
//         } catch (e) {
//             console.error("Token lỗi:", e);
//         }
//     }, []);
//
//     // Nếu chưa load xong admin → hiện loading
//     if (!currentAdmin) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div>Đang tải thông tin admin...</div>
//             </div>
//         );
//     }
//     return (
//         <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
//             {/* Navbar Admin */}
//             <Navbar/>
//
//             <div className="flex flex-1 w-full min-w-0">
//                 {/* Sidebar */}
//                 <AppSidebar/>
//
//                 {/* Content */}
//                 <div className="flex-1 w-full min-w-0 p-4 overflow-auto">
//                     <Routes>
//                         <Route path="/" element={<Dashboard/>}/>
//                         <Route path="/schedule" element={<Schedule/>}/>
//                         {/*<Route path="/bookings" element={<Bookings />} />*/}
//                         <Route path="/fields" element={<Fields/>}/>
//                         <Route path="/users" element={<Users/>}/>
//                         <Route path="/chat-with-user" element={<AdminDashboard currentAdmin={currentAdmin} />}/>
//                         {/*<Route path="*" element={<NotFoundPage />} />*/}
//                     </Routes>
//                 </div>
//             </div>
//         </div>
//     );
// };
const AdminLayout = () => {
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const location = useLocation(); // Thêm để biết đang ở trang admin

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            let adminId =
                payload.id ||
                payload.userId ||
                (payload.sub && !isNaN(payload.sub) ? Number(payload.sub) : null);

            if (!adminId || isNaN(adminId)) {
                console.warn("Token không chứa ID số hợp lệ. Vẫn tiếp tục đăng nhập admin.");
                adminId = null;
            }

            setCurrentAdmin({
                id: adminId,
                name: payload.name || payload.username || payload.email || "Admin",
                role: payload.role || "ADMIN",
                avatar: payload.avatar || null
            });
        } catch (err) {
            console.error("JWT decode error:", err);
        }
    }, []);

    // Loading state
    if (!currentAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-lg">Đang tải thông tin admin...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            {/* ⭐ DÙNG CHUNG NAVBAR - ẨN MỘT SỐ NÚT KHI LÀ ADMIN */}
            <Navbar />

            <div className="flex flex-1">
                {/* Sidebar bên trái */}
                <AppSidebar currentAdmin={currentAdmin} />

                {/* Nội dung chính */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/fields" element={<Fields />} />
                        <Route path="/users" element={<Users />} />
                        <Route
                            path="/chat-with-user"
                            element={<AdminDashboard currentAdmin={currentAdmin} />}
                        />
                        {/* Thêm các route admin khác ở đây */}
                    </Routes>
                </div>
            </div>
        </div>
    );
};

function App() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith("/admin");
    return (
        <>
            <ScrollToTop/>
            <GoogleOAuthProvider clientId="372998325078-1rtdln50u6o3apfgm294icrpru8itp5b.apps.googleusercontent.com">
                {!isAdminPage && localStorage.getItem("token") && <ChatWidget />}
                <Routes>
                    {/* Phần User */}

                    <Route
                        path="/*"
                        element={

                            <AppLayout>
                                <Routes>
                                    <Route path="/" element={<Home/>}/>
                                    <Route path="/about" element={<AboutUs/>}/>
                                    <Route path="/booking" element={<BookingPage/>}/>
                                    <Route path="/booking/:variantId" element={<BookingFormPage/>}/>
                                    <Route path="/booking-result" element={<BookingResultPage/>}/>
                                    <Route path="/sitemap" element={<SitemapPage/>}/>
                                    <Route path="/login" element={<LoginPage/>}/>
                                    <Route path="/register" element={<Register/>}/>
                                    <Route path="/verify-otp" element={<VerifyOtp/>}/>
                                    <Route
                                        path="/profile"
                                        element={
                                            <AuthProvider>
                                                <Profile/>
                                            </AuthProvider>
                                        }
                                    />
                                    <Route path="/booking-history" element={<UserBookingHistory/>}/>

                                    <Route path="/qr" element={<QrPaymentPage/>}/>
                                    <Route path="/qr_result" element={<BookingResult/>}/>
                                </Routes>
                            </AppLayout>
                        }
                    />

                    {/* Phần Admin */}
                    <Route path="/admin/*" element={<AdminLayout/>}/>
                </Routes>
            </GoogleOAuthProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 2500,
                    style: {
                        background: "#363636",
                        color: "#fff",
                        zIndex: 999999,
                    },
                    success: {
                        duration: 2500,
                        style: {
                            background: "#10B981",
                            color: "#fff",
                            zIndex: 999999,
                        },
                    },
                    error: {
                        duration: 2500,
                        style: {
                            background: "#EF4444",
                            color: "#fff",
                            zIndex: 999999,
                        },
                    },
                }}
            />
        </>
    );
}

export default App;

