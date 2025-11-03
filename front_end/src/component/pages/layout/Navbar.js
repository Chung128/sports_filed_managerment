import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
    Bars3Icon,
    XMarkIcon,
    UserIcon,
    ArrowRightEndOnRectangleIcon,
    ChevronDownIcon,
    // IdentificationIcon, // Đã loại bỏ icon không dùng
    ReceiptPercentIcon,
    CalendarDaysIcon,
    // CreditCardIcon, // Đã loại bỏ icon không dùng
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { getCurrentUser } from "../../../service/login/authApi";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [user, setUser] = useState(null);

    // --- Logic Fetch User ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getCurrentUser();
                setUser({
                    name: userData.name || "Người dùng",
                    avatar: userData.avatar || null,
                    role: userData.role || 'USER'
                });
            } catch (err) {
                setUser(null);
            }
        };

        fetchData().then();
    }, []);

    // --- Logic Đóng dropdown/menu khi click ra ngoài hoặc chuyển trang ---
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // --- Hàm Đăng xuất ---
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        toast.success("Đăng xuất thành công!");
        navigate("/login");
    };

    // --- HÀM XỬ LÝ CLICK ĐẶT SÂN (QUAN TRỌNG) ---
    const handleBookingClick = (e) => {
        // Kiểm tra nếu user chưa đăng nhập
        if (!user) {
            e.preventDefault(); // Ngăn chuyển trang mặc định
            setMobileMenuOpen(false); // Đóng menu mobile nếu đang mở
            toast.error("Vui lòng đăng nhập để tiến hành đặt sân!");
            navigate("/login"); // Chuyển hướng đến trang Đăng nhập
        }
        // Nếu user đã đăng nhập, không làm gì cả, NavLink sẽ tự chuyển hướng
    };

    // --- Data Links ---
    const navLinks = [
        { path: "/", label: "Trang chủ" },
        { path: "/about", label: "Giới thiệu" },
        { path: "/booking", label: "Đặt sân", checkAuth: true }, // Thêm cờ checkAuth
    ];

    const userMenuItems = [
        { path: "/profile", label: "Hồ sơ cá nhân", icon: UserIcon },
        { path: "/booking-history", label: "Lịch sử đặt sân", icon: CalendarDaysIcon },
        //{ path: "/vouchers", label: "Ưu đãi", icon: ReceiptPercentIcon },
    ];

    const avatarSrc = user?.avatar
        ? `http://localhost:8080${user.avatar}`
        : "/default-avatar.png";


    return (
        <header className="bg-white shadow-lg sticky top-0 z-50 transition-all duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                <Link
                    to="/"
                    className="flex items-center gap-2 h-10 bg-gradient-to-r from-blue-900 to-red-600 rounded"
                >
                    <div className="text-white font-bold text-base px-2 py-1 rounded">
                        Tuyên Sơn
                    </div>
                    <img
                        src="/logo/logo.png"
                        alt="Logo"
                        className="w-8 h-8 object-contain"
                    />
                </Link>


                {/* 2. Menu Desktop */}
                <div className="hidden lg:flex items-center space-x-6">
                    <nav className="flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                // ÁP DỤNG HÀM XỬ LÝ SỰ KIỆN Ở ĐÂY
                                onClick={link.checkAuth ? handleBookingClick : undefined}
                                className={({ isActive }) =>
                                    `text-base font-semibold transition-all duration-200 ease-in-out relative group ${
                                        isActive
                                            ? "text-blue-600"
                                            : "text-gray-700 hover:text-blue-500"
                                    }`
                                }
                            >
                                {link.label}
                                {/* Hiệu ứng gạch chân mượt mà */}
                                <span className={`absolute bottom-[-5px] left-0 w-full h-[3px] bg-blue-600 rounded-full transition-transform duration-300 ${
                                    location.pathname === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-75"
                                }`}></span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Auth Section */}
                    <div className="pl-4 border-l border-gray-200">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full hover:bg-blue-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-expanded={dropdownOpen}
                                    aria-haspopup="true"
                                >
                                    <span className="text-sm font-semibold text-gray-800 hidden md:block">{user.name}</span>
                                    <ChevronDownIcon
                                        className={`w-4 h-4 text-blue-600 transition-transform duration-300 ${
                                            dropdownOpen ? "rotate-180" : "rotate-0"
                                        }`}
                                    />
                                    <img
                                        src={avatarSrc}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-400 shadow-md"
                                        alt="user avatar"
                                    />

                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 divide-y divide-gray-100 animate-fade-in-down" style={{animationDuration: '0.2s'}}>

                                        {userMenuItems.map((item) => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-150"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <item.icon className="w-5 h-5 mr-3 text-blue-500" />
                                                {item.label}
                                            </Link>
                                        ))}

                                        {/* Nút Đăng xuất riêng biệt */}
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-b-xl transition duration-150"
                                        >
                                            <ArrowRightEndOnRectangleIcon className="w-5 h-5 mr-3 text-red-500" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex space-x-3">
                                <Link
                                    to="/login"
                                    className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                                >
                                    Đăng nhập
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Mobile Menu Button */}
                <button
                    className="lg:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 transition"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <XMarkIcon className="w-6 h-6" />
                    ) : (
                        <Bars3Icon className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* 4. Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-16 left-0 w-full bg-white shadow-xl z-40 animate-slide-down">
                    <div className="flex flex-col p-4 space-y-2 border-b border-gray-100">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                // ÁP DỤNG HÀM XỬ LÝ SỰ KIỆN Ở ĐÂY
                                onClick={link.checkAuth ? handleBookingClick : undefined}
                                className={({ isActive }) =>
                                    `block px-4 py-2 text-base font-medium rounded-lg transition ${
                                        isActive
                                            ? "bg-blue-100 text-blue-600"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="p-4 flex flex-col space-y-2">
                        {/* Auth Section Mobile */}
                        {user ? (
                            <>
                                <div className="flex items-center p-3 space-x-3 border-b border-gray-100 mb-2">
                                    <img src={avatarSrc} className="w-10 h-10 rounded-full object-cover border-2 border-blue-400" alt="user avatar" />
                                    <span className="text-lg font-bold text-gray-800">{user.name}</span>
                                </div>

                                {userMenuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
                                    >
                                        <item.icon className="w-5 h-5 mr-3 text-blue-500" />
                                        {item.label}
                                    </Link>
                                ))}

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <ArrowRightEndOnRectangleIcon className="w-5 h-5 mr-3 text-red-500" />
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="block text-center px-4 py-2 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                            >
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Thêm keyframes cho Animation */}
            <style jsx="true">{`
                @keyframes slide-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out forwards;
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.2s ease-out forwards;
                }
            `}</style>
        </header>
    );
}