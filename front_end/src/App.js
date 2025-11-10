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
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

// --- User pages ---
import Navbar from "./component/pages/layout/Navbar";
import Footer from "./component/pages/layout/Footer";
import Home from "./component/pages/Home";
import AboutUs from "./component/pages/AboutUs";
import Profile from "./component/user/Profile";
import { AuthProvider } from "./service/user/context/authContext";

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
const AppLayout = ({ children }) => {
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
            {shouldShowNavbar && <Navbar />}
            <main className="flex-1">{children}</main>
            {shouldShowFooter && <Footer />}
        </div>
    );
};

// Layout cho admin
// const AdminLayout = () => {
//     return (
//         <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
//             <AppSidebar />
//             <div className="flex-1 w-full min-w-0 p-4">
//                 <Routes>
//                     <Route path="/dashboard" element={<Dashboard />} />
//                     <Route path="/schedule" element={<Schedule />} />
//                     <Route path="/bookings" element={<Bookings />} />
//                     <Route path="/fields" element={<Fields />} />
//                     <Route path="/users" element={<Users />} />
//                     {/*<Route path="*" element={<NotFound />} />*/}
//                 </Routes>
//             </div>
//         </div>
//     );
// };
const AdminLayout = () => {
    return (
        <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navbar Admin */}
            <Navbar/>

            <div className="flex flex-1 w-full min-w-0">
                {/* Sidebar */}
                <AppSidebar />

                {/* Content */}
                <div className="flex-1 w-full min-w-0 p-4 overflow-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/bookings" element={<Bookings />} />
                        <Route path="/fields" element={<Fields />} />
                        <Route path="/users" element={<Users />} />
                        {/*<Route path="*" element={<NotFoundPage />} />*/}
                    </Routes>
                </div>
            </div>
        </div>
    );
};


function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Phần User */}
                <Route
                    path="/*"
                    element={
                        <AppLayout>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<AboutUs />} />
                                <Route path="/booking" element={<BookingPage />} />
                                <Route path="/booking/:variantId" element={<BookingFormPage />} />
                                <Route path="/booking-result" element={<BookingResultPage />} />
                                <Route path="/sitemap" element={<SitemapPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/verify-otp" element={<VerifyOtp />} />
                                <Route
                                    path="/profile"
                                    element={
                                        <AuthProvider>
                                            <Profile />
                                        </AuthProvider>
                                    }
                                />
                            </Routes>
                        </AppLayout>
                    }
                />

                {/* Phần Admin */}
                <Route path="/admin/*" element={<AdminLayout />} />
            </Routes>

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

