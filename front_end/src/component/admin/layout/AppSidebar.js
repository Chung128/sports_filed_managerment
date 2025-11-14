import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Grid3x3,
    Clock,
    Sparkles,
    Menu,
    X,
} from "lucide-react";

export function AppSidebar() {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // --- Bắt vuốt để mở/đóng sidebar ---
    useEffect(() => {
        let startX = 0;
        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
        };
        const handleTouchEnd = (e) => {
            const endX = e.changedTouches[0].clientX;
            if (endX - startX > 100) setMobileOpen(true); // vuốt phải để mở
            if (startX - endX > 100) setMobileOpen(false); // vuốt trái để đóng
        };
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchend", handleTouchEnd);
        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);

    const menuItems = [
        { title: "Tổng Quan", icon: LayoutDashboard, href: "/admin", description: "Dashboard & Thống kê" },
        { title: "Lịch Đặt Sân", icon: Clock, href: "/admin/schedule", description: "Xem theo ngày & giờ" },
        //{ title: "Quản Lý Đặt Sân", icon: Calendar, href: "/admin/bookings", description: "Danh sách booking" },
        { title: "Quản Lý Sân", icon: Grid3x3, href: "/admin/fields", description: "Thông tin sân bóng" },
        { title: "Khách Hàng", icon: Users, href: "/admin/users", description: "Quản lý người dùng" },
    ];

    // --- Class sidebar ---
    const sidebarClasses = `
        bg-white border-r border-gray-200 flex flex-col
        fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)]  /* 4rem = chiều cao navbar */
        z-40 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    `;

    return (
        <>
            {/* Nút mở sidebar khi mobile */}
            {!mobileOpen && (
                <button
                    onClick={() => setMobileOpen(true)}
                    className="fixed top-20 left-4 z-50 lg:hidden bg-green-600 text-white p-2 rounded-lg shadow-md"
                >
                    <Menu className="w-5 h-5" />
                </button>
            )}

            {/* Overlay làm mờ nền khi mở sidebar trên mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={sidebarClasses}>
                {/* Header Sidebar */}
                <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Grid3x3 className="text-white" size={22} />
                            </div>
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Sparkles size={8} className="text-yellow-900" />
                            </div>
                        </div>
                        {!collapsed && (
                            <div>
                                <h1 className="text-base font-bold text-gray-900">Trang quản lý</h1>
                                {/*<p className="text-xs text-gray-600">Hệ thống quản lý</p>*/}
                            </div>
                        )}
                    </div>

                    {/* Nút đóng sidebar trên mobile */}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden text-gray-600 hover:text-red-500 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {!collapsed && (
                        <p className="text-xs font-semibold text-gray-500 px-3 mb-2">
                            MENU CHÍNH
                        </p>
                    )}
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                    isActive
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                                        : "hover:bg-gray-100 text-gray-800"
                                }`}
                            >
                                <item.icon
                                    className={`h-5 w-5 ${
                                        isActive ? "text-white" : "text-gray-600"
                                    }`}
                                />
                                {!collapsed && (
                                    <div className="flex flex-col">
                                        <span
                                            className={`font-medium ${
                                                isActive ? "text-white" : "text-gray-900"
                                            }`}
                                        >
                                            {item.title}
                                        </span>
                                        <span
                                            className={`text-xs ${
                                                isActive
                                                    ? "text-green-100"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {item.description}
                                        </span>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                {!collapsed && (
                    <div className="border-t border-gray-200 p-4">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                            <p className="text-xs font-semibold text-gray-700 mb-1">
                                💡 Mẹo
                            </p>
                            <p className="text-xs text-gray-600">
                                Sử dụng bộ lọc để tìm kiếm nhanh hơn
                            </p>
                        </div>
                    </div>
                )}

                {/* Nút thu gọn sidebar */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute bottom-4 right-4 bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded-full shadow-sm hidden lg:block transition"
                    title={collapsed ? "Mở rộng" : "Thu gọn"}
                >
                    {collapsed ? "→" : "←"}
                </button>
            </aside>
        </>
    );
}

export default AppSidebar;
