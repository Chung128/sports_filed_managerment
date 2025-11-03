import './App.css';
import {Routes,
    Route,
    useLocation,
    Navigate,} from "react-router-dom";

import {useEffect} from "react";
import SitemapPage from "./component/pages/layout/MapPage";
import Home from "./component/pages/Home";
import {Toaster} from "react-hot-toast";
import Navbar from "./component/pages/layout/Navbar";
import Footer from "./component/pages/layout/Footer";
import AboutUs from "./component/pages/AboutUs";
import Login from "./component/login/LoginPage";
import Register from "./component/login/Register";
import Profile from "./component/user/Profile";
import {AuthProvider} from "./service/context/authContext";
import VerifyOtp from "./component/login/VerifyOtp";
import BookingPage from "./component/booking/BookingPage";
import BookingFormPage from "./component/booking/BookingFormPage";
import BookingResultPage from "./component/booking/BookingResultPage";

// Component để scroll to top khi navigate
const ScrollToTop = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return null;
};

// Component để xác định có hiển thị Navbar/Footer không
const AppLayout = ({children}) => {
    const location = useLocation();
    const isAuthPage = [
        "/login",
        "/register",
        "/reset-password",
        "/forgot-password",
        "/verification"
    ].includes(location.pathname);

    const isAdminPage = location.pathname.startsWith("/admin");
    const isLegalPage = ["/terms", "/privacy"].includes(location.pathname);

    const isErrorPage = ["/not-found"].includes(location.pathname);
    // Hiển thị Navbar ở tất cả pages trừ auth pages, admin pages và legal pages
    const shouldShowNavbar =
        !isAuthPage && !isAdminPage && !isLegalPage && !isErrorPage;

    // Hiển thị Footer ở tất cả pages trừ auth pages và admin pages (bao gồm cả legal pages)
    const shouldShowFooter = !Profile && !isAdminPage && !isErrorPage;

    return (
        <div className="min-h-screen flex flex-col">
          {shouldShowNavbar && <Navbar />}
          <main className="flex-1">{children}</main>
          {shouldShowFooter && <Footer />}
        </div>
    );
};

// AppLayout.propTypes = {
//     children: PropTypes.node.isRequired,
// };

function App() {
    return (<>
            <ScrollToTop/>
            <Routes>
                <Route
                    path="/*"
                    element={
                        <AppLayout>
                            <Routes>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/about" element={<AboutUs />} />
                                <Route path="/booking" element={<BookingPage />} />
                                <Route path="/booking/:variantId" element={<BookingFormPage />} />                                {/*<Route path="/help" element={<HelpPage />} />*/}
                                <Route path="/booking-result" element={<BookingResultPage />} />
                                {/*<Route path="/guide" element={<GuidePage />} />*/}
                                <Route path="/sitemap" element={<SitemapPage/>}/>
                                <Route
                                    path="/login"
                                    element={
                                    <Login/>
                                      // <GuestRoute>
                                      //   <LoginPage />
                                      // </GuestRoute>
                                    }
                                />
                                <Route
                                    path="/register"
                                    element={
                                    <Register/>
                                      // <GuestRoute>
                                      //   <RegisterPage />
                                      // </GuestRoute>
                                    }/>
                                <Route path="/verify-otp" element={<VerifyOtp />} />
                                {/*<Route path="/oauth2/success" element={<OAuth2Success />} />*/}
                                {/*<Route path="/terms" element={<TermsPage />} />*/}
                                {/*<Route path="/privacy" element={<PrivacyPage />} />*/}
                                {/*<Route path="/contact" element={<ContactPage />} />*/}
                                {/*<Route path="/features" element={<FeaturesPage />} />*/}
                                {/*<Route path="/pricing" element={<ListComponent />} />*/}
                                {/*<Route*/}
                                {/*    path="/forgot-password"*/}
                                {/*    element={<ForgotPasswordPage />}*/}
                                {/*/>*/}
                                {/*<Route path="/reset-password" element={<ResetPasswordPage />} />*/}
                                {/*<Route*/}
                                {/*    path="/payment-result"*/}
                                {/*    element={*/}
                                {/*      <ProtectedRoute>*/}
                                {/*        <PaymentResultComponent />*/}
                                {/*      </ProtectedRoute>*/}
                                {/*    }*/}
                                {/*/>*/}
                                {/*<Route*/}
                                {/*    path="/campaign-manager"*/}
                                {/*    element={*/}
                                {/*      <ProtectedRoute>*/}
                                {/*        <CampaignManager />*/}
                                {/*      </ProtectedRoute>*/}
                                {/*    }*/}
                                {/*/>*/}
                                <Route
                                    path="/profile"
                                    element={
                                      <AuthProvider>
                                        <Profile />
                                      </AuthProvider>
                                    }
                                />
                                {/*<Route*/}
                                {/*    path="/settings"*/}
                                {/*    element={*/}
                                {/*      <ProtectedRoute>*/}
                                {/*        {" "}*/}
                                {/*        <Settings />*/}
                                {/*      </ProtectedRoute>*/}
                                {/*    }*/}
                                {/*/>*/}
                                {/*<Route*/}
                                {/*    path="/workspace"*/}
                                {/*    element={*/}
                                {/*      <ProtectedRoute>*/}
                                {/*        <WorkspacePage />*/}
                                {/*      </ProtectedRoute>*/}
                                {/*    }*/}
                                {/*/>*/}
                                {/*<Route*/}
                                {/*    path="/workspaces/:workspaceId"*/}
                                {/*    element={*/}
                                {/*      <ProtectedRoute>*/}
                                {/*        <WorkspaceDetailPage />*/}
                                {/*      </ProtectedRoute>*/}
                                {/*    }*/}
                                {/*/>*/}
                                {/*<Route*/}
                                {/*    path="/ai-generated-posts"*/}
                                {/*    element={*/}
                                {/*      <ProtectedRoute>*/}
                                {/*        <AIGeneratedPostsPage />*/}
                                {/*      </ProtectedRoute>*/}
                                {/*    }*/}
                                {/*/>*/}
                                {/*<Route*/}
                                {/*    path="/ai-generated-posts/:id"*/}
                                {/*    element={*/}
                                {/*      <ProtectedRoute>*/}
                                {/*        <AIGeneratedPostDetailPage />*/}
                                {/*      </ProtectedRoute>*/}
                                {/*    }*/}
                                {/*/>*/}
                                {/*<Route*/}
                                {/*    path="/transaction_history"*/}
                                {/*    element={*/}
                                {/*      <ProtectedRoute>*/}
                                {/*        <TransactionSuccess/>*/}
                                {/*      </ProtectedRoute>*/}
                                {/*    }*/}
                                {/*/>*/}
                                {/*<Route*/}
                                {/*    path="/*"*/}
                                {/*    element={<Navigate to="/not-found" replace />}*/}
                                {/*/>*/}
                            </Routes>
                        </AppLayout>}
                />
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
