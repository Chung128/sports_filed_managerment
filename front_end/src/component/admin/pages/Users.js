// import React, { useState, useEffect } from "react";
// import { Search, Mail, Phone, Calendar, DollarSign, TrendingUp, Award, Users as UsersIcon } from "lucide-react";
// import {fetchUserDetail, fetchUsers} from "../../../service/admin/user_information/usersApi";
//
// const Badge = ({ children, className }) => (
//     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>{children}</span>
// );
//
// const Avatar = ({ children, className }) => (
//     <div className={`flex items-center justify-center rounded-full overflow-hidden ${className}`}>{children}</div>
// );
//
// const AvatarFallback = ({ children }) => <span>{children}</span>;
//
// const UsersComponent = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [selectedUserData, setSelectedUserData] = useState(null);
//     const [userBookings, setUserBookings] = useState([]);
//
//     useEffect(() => {
//         fetchUsers()
//             .then(data => {
//                 setUsers(data);
//                 setLoading(false);
//             })
//             .catch(() => {
//                 setError("Không thể tải dữ liệu");
//                 setLoading(false);
//             });
//     }, []);
//
//     useEffect(() => {
//         if (!selectedUser) return;
//         fetchUserDetail(selectedUser)
//             .then(data => {
//                 setSelectedUserData(data);
//                 setUserBookings(data.bookingHistory || []);
//             })
//             .catch(() => {});
//     }, [selectedUser]);
//
//     const filteredUsers = users.filter(user =>
//         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.phone?.includes(searchTerm)
//     );
//
//     const formatCurrency = (value) =>
//         new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
//
//     const formatDate = (dateString) =>
//         new Date(dateString).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
//
//     const getInitials = (name) =>
//         name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
//
//     const getCustomerLevel = (totalBookings) => {
//         switch (true) {
//             case totalBookings < 5:
//                 return "Khách hàng mới";
//             case totalBookings >= 5 && totalBookings <= 10:
//                 return "Khách hàng cơ bản";
//             case totalBookings > 10:
//                 return "Khách hàng thân thiết";
//             default:
//                 return "Khách hàng";
//         }
//     };
//
//     if (loading) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
//     if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
//
//     return (
//         <div className="flex flex-col h-full w-full">
//             <header className="flex items-center sticky top-0 z-10 gap-4 border-b bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm">
//                 <div className="flex-1">
//                     <h1 className="text-2xl font-bold text-gray-900">
//                         Quản Lý Khách Hàng
//                     </h1>
//                     <p className="text-sm text-gray-500">Danh sách khách hàng từ hệ thống</p>
//                 </div>
//                 <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
//                     <UsersIcon className="h-4 w-4 text-green-600" />
//                     <span className="text-sm font-semibold text-green-700">{users.length}</span>
//                     <span className="text-sm text-green-600">khách hàng</span>
//                 </div>
//             </header>
//
//             <main className="flex-1 overflow-auto p-6">
//                 <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Danh sách người dùng */}
//                     <div className="lg:col-span-1">
//                         <div className="shadow-lg sticky top-6 rounded-xl border">
//                             <div className="bg-green-50 p-4 border-b">
//                                 <h2 className="text-lg font-bold">Danh Sách Khách Hàng</h2>
//                                 <div className="relative mt-4">
//                                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                                     <input
//                                         type="text"
//                                         placeholder="Tìm kiếm..."
//                                         value={searchTerm}
//                                         onChange={e => setSearchTerm(e.target.value)}
//                                         className="pl-10 w-full border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto space-y-2">
//                                 {filteredUsers.map(user => (
//                                     <div
//                                         key={user.id}
//                                         onClick={() => setSelectedUser(user.id)}
//                                         className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selectedUser === user.id
//                                             ? 'bg-green-50 border-green-500 shadow-md scale-105'
//                                             : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
//                                         }`}
//                                     >
//                                         <div className="flex items-center gap-3">
//                                             <Avatar className="h-14 w-14 ring-2 ring-white shadow-lg">
//                                                 {user.avatar ? (
//                                                     <img src={`http://localhost:8080${user.avatar}`} alt={user.name} className="h-full w-full object-cover rounded-full" />
//                                                 ) : (
//                                                     <AvatarFallback className="text-white font-bold text-lg">{getInitials(user.name)}</AvatarFallback>
//                                                 )}
//                                             </Avatar>
//                                             <div className="flex-1 min-w-0">
//                                                 <h4 className="font-semibold text-gray-900 truncate">{user.name}</h4>
//                                                 <p className="text-sm text-gray-500 truncate">{user.phone}</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Chi tiết người dùng */}
//                     <div className="lg:col-span-2">
//                         {selectedUserData ? (
//                             <div className="space-y-6">
//                                 {/* Thông tin user */}
//                                 <div className="shadow-lg overflow-hidden rounded-xl">
//                                     <div className="h-24 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"></div>
//                                     <div className="relative pt-0 pb-6 px-6">
//                                         <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12">
//                                             <Avatar className="h-24 w-24 ring-4 ring-white shadow-xl">
//                                                 {selectedUserData.avatar ? (
//                                                     <img
//                                                         src={`http://localhost:8080${selectedUserData.avatar}`}
//                                                         alt={selectedUserData.name}
//                                                         className="h-full w-full object-cover rounded-full"
//                                                     />
//                                                 ) : (
//                                                     <AvatarFallback className="text-white font-bold text-3xl">{getInitials(selectedUserData.name)}</AvatarFallback>
//                                                 )}
//                                             </Avatar>
//                                             <div className="flex-1">
//                                                 <div className="flex items-center gap-3 mb-2">
//                                                     <h2 className="text-3xl font-bold text-gray-900">{selectedUserData.name}</h2>
//                                                 </div>
//                                                 <p className="text-gray-600">{getCustomerLevel(selectedUserData.totalBookings)}</p>
//                                             </div>
//                                         </div>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//                                             <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
//                                                 <div className="p-2 bg-blue-500 rounded-lg"><Mail className="text-white" size={20} /></div>
//                                                 <div>
//                                                     <p className="text-xs text-blue-600 font-medium">Email</p>
//                                                     <p className="text-sm font-semibold text-gray-900">{selectedUserData.email}</p>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
//                                                 <div className="p-2 bg-green-500 rounded-lg"><Phone className="text-white" size={20} /></div>
//                                                 <div>
//                                                     <p className="text-xs text-green-600 font-medium">Số điện thoại</p>
//                                                     <p className="text-sm font-semibold text-gray-900">{selectedUserData.phone}</p>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
//                                                 <div className="p-2 bg-purple-500 rounded-lg"><Calendar className="text-white" size={20} /></div>
//                                                 <div>
//                                                     <p className="text-xs text-purple-600 font-medium">Địa chỉ</p>
//                                                     <p className="text-sm font-semibold text-gray-900">{selectedUserData.address || 'Chưa có'}</p>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
//                                                 <div className="p-2 bg-orange-500 rounded-lg"><TrendingUp className="text-white" size={20} /></div>
//                                                 <div>
//                                                     <p className="text-xs text-orange-600 font-medium">Tổng đơn đặt</p>
//                                                     <p className="text-sm font-semibold text-gray-900">{selectedUserData.totalBookings} lượt</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//
//                                         <div className="mt-6 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl text-white flex items-center justify-between">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><DollarSign size={32} /></div>
//                                                 <div>
//                                                     <p className="text-sm opacity-90">Tổng chi tiêu</p>
//                                                     <p className="text-3xl font-bold">{formatCurrency(selectedUserData.totalSpent)}</p>
//                                                 </div>
//                                             </div>
//                                             <Award size={48} className="opacity-20" />
//                                         </div>
//                                     </div>
//                                 </div>
//
//                                 {/* Lịch sử đặt sân */}
//                                 <div className="shadow-lg rounded-xl p-6 bg-white">
//                                     <h3 className="text-xl font-bold mb-4">Lịch Sử Đặt Sân</h3>
//                                     {userBookings.length > 0 ? (
//                                         <div className="space-y-3">
//                                             {userBookings.map(b => (
//                                                 <div key={b.id} className="p-5 border-2 rounded-xl bg-white hover:shadow-lg transition-all hover:border-green-300">
//                                                     <div className="flex justify-between items-start mb-3">
//                                                         <div>
//                                                             <h4 className="font-bold text-lg text-gray-900">{b.fieldName}</h4>
//                                                             <p className="text-sm text-gray-500">{formatDate(b.date)} • {b.timeSlot}</p>
//                                                         </div>
//                                                         <Badge className={b.status === 'completed' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}>
//                                                             {b.status === 'completed' ? 'Hoàn thành' : 'Đã xác nhận'}
//                                                         </Badge>
//                                                     </div>
//                                                     <div className="flex justify-between items-center mt-4 pt-4 border-t">
//                                                         <span className="text-sm text-gray-600 font-medium">{formatCurrency(b.price)}</span>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ) : (
//                                         <p className="text-gray-500 italic">Chưa có lịch sử đặt sân.</p>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="shadow-lg rounded-xl p-20 text-center">
//                                 <div className="inline-block p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6">
//                                     <Search className="h-16 w-16 text-green-600" />
//                                 </div>
//                                 <h3 className="text-2xl font-bold text-gray-900 mb-3">Chọn một khách hàng</h3>
//                                 <p className="text-gray-600 text-lg">Chọn khách hàng từ danh sách bên trái để xem chi tiết và lịch sử đặt sân</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };
//
// export default UsersComponent;
//
import React, { useState, useEffect } from "react";
import {
    Search, Mail, Phone, Calendar, DollarSign,
    TrendingUp, Award, Users as UsersIcon
} from "lucide-react";
import { fetchUserDetail, fetchUsers } from "../../../service/admin/user_information/usersApi";
import CourtHistoryModal from "../modal/CourtHistoryModal";
import CustomerListModal from "../modal/CustomerListModal";
import {getDynamicStatus} from "../../../service/user/booking/bookingApi";

const Badge = ({ children, className }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>{children}</span>
);

const Avatar = ({ children, className }) => (
    <div className={`flex items-center justify-center rounded-full overflow-hidden ${className}`}>{children}</div>
);

const AvatarFallback = ({ children }) => <span>{children}</span>;

const UsersComponent = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [userBookings, setUserBookings] = useState([]);
    const [showCourtModal, setShowCourtModal] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);

    useEffect(() => {
        fetchUsers()
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Không thể tải dữ liệu");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!selectedUser) return;
        fetchUserDetail(selectedUser)
            .then(data => {
                setSelectedUserData(data);
                setUserBookings(data.bookingHistory || []);
            })
            .catch(() => {});
    }, [selectedUser]);

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    const formatCurrency = (value) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

    const getInitials = (name) =>
        name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    const getCustomerLevel = (totalBookings) => {
        switch (true) {
            case totalBookings < 5:
                return "Khách hàng mới";
            case totalBookings >= 5 && totalBookings <= 10:
                return "Khách hàng cơ bản";
            case totalBookings > 10:
                return "Khách hàng thân thiết";
            default:
                return "Khách hàng";
        }
    };

    if (loading) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
    if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
    const handleOpenCourtModal = () => setShowCourtModal(true);
    const handleCloseCourtModal = () => setShowCourtModal(false);

    const handleOpenCustomerModal = () => setShowCustomerModal(true);
    const handleCloseCustomerModal = () => setShowCustomerModal(false);


    return (
        <div className="flex flex-col h-full w-full">
            <header className="flex items-center sticky top-0 z-10 gap-4 border-b bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản Lý Khách Hàng
                    </h1>
                    <p className="text-sm text-gray-500">Danh sách khách hàng từ hệ thống</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                    <UsersIcon className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">{users.length}</span>
                    <span className="text-sm text-green-600">khách hàng</span>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Danh sách người dùng */}
                    <div className="lg:col-span-1">
                        <div className="shadow-lg sticky top-6 rounded-xl border">
                            <div className="bg-green-50 p-4 border-b">
                                <h2 className="text-lg font-bold">Danh Sách Khách Hàng</h2>
                                <div className="relative mt-4">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="pl-10 w-full border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                            <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto space-y-2">
                                {filteredUsers.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => setSelectedUser(user.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selectedUser === user.id
                                            ? 'bg-green-50 border-green-500 shadow-md scale-105'
                                            : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-14 w-14 ring-2 ring-white shadow-lg">
                                                {user.avatar ? (
                                                    <img src={`http://localhost:8080${user.avatar}`} alt={user.name} className="h-full w-full object-cover rounded-full" />
                                                ) : (
                                                    <AvatarFallback className="text-white font-bold text-lg">{getInitials(user.name)}</AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 truncate">{user.name}</h4>
                                                <p className="text-sm text-gray-500 truncate">{user.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Chi tiết người dùng */}
                    <div className="lg:col-span-2">
                        {selectedUserData ? (
                            <div className="space-y-6">
                                {/* Thông tin user */}
                                <div className="shadow-lg overflow-hidden rounded-xl">
                                    <div className="h-24 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"></div>
                                    <div className="relative pt-0 pb-6 px-6">
                                        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12">
                                            <Avatar className="h-24 w-24 ring-4 ring-white shadow-xl">
                                                {selectedUserData.avatar ? (
                                                    <img
                                                        src={`http://localhost:8080${selectedUserData.avatar}`}
                                                        alt={selectedUserData.name}
                                                        className="h-full w-full object-cover rounded-full"
                                                    />
                                                ) : (
                                                    <AvatarFallback className="text-white font-bold text-3xl">
                                                        {getInitials(selectedUserData.name)}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h2 className="text-3xl font-bold text-gray-900">{selectedUserData.name}</h2>
                                                </div>
                                                <p className="text-gray-600">{getCustomerLevel(selectedUserData.totalBookings)}</p>
                                            </div>
                                        </div>

                                        {/* Thông tin chi tiết */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                                <div className="p-2 bg-blue-500 rounded-lg"><Mail className="text-white" size={20} /></div>
                                                <div>
                                                    <p className="text-xs text-blue-600 font-medium">Email</p>
                                                    <p className="text-sm font-semibold text-gray-900">{selectedUserData.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                                <div className="p-2 bg-green-500 rounded-lg"><Phone className="text-white" size={20} /></div>
                                                <div>
                                                    <p className="text-xs text-green-600 font-medium">Số điện thoại</p>
                                                    <p className="text-sm font-semibold text-gray-900">{selectedUserData.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                                                <div className="p-2 bg-purple-500 rounded-lg"><Calendar className="text-white" size={20} /></div>
                                                <div>
                                                    <p className="text-xs text-purple-600 font-medium">Địa chỉ</p>
                                                    <p className="text-sm font-semibold text-gray-900">{selectedUserData.address || 'Chưa có'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                                                <div className="p-2 bg-orange-500 rounded-lg"><TrendingUp className="text-white" size={20} /></div>
                                                <div>
                                                    <p className="text-xs text-orange-600 font-medium">Tổng đơn đặt</p>
                                                    <p className="text-sm font-semibold text-gray-900">{selectedUserData.totalBookings} lượt</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tổng chi tiêu */}
                                        <div className="mt-6 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl text-white flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><DollarSign size={32} /></div>
                                                <div>
                                                    <p className="text-sm opacity-90">Tổng chi tiêu</p>
                                                    <p className="text-3xl font-bold">{formatCurrency(selectedUserData.totalSpent)}</p>
                                                </div>
                                            </div>
                                            <Award size={48} className="opacity-20" />
                                        </div>
                                    </div>
                                </div>

                                {/* 🔹 Lịch sử đặt sân có trạng thái động (có tìm kiếm + xem tất cả + modal) */}
                                <div className="shadow-lg rounded-xl p-6 bg-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-blue-600" /> Lịch Sử Đặt Sân
                                        </h3>

                                        {/* Ô tìm kiếm */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setShowCourtModal(true)}
                                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                                            >
                                                Xem tất cả
                                            </button>
                                        </div>
                                    </div>

                                    {userBookings.length > 0 ? (
                                        <div className="space-y-3">
                                            {userBookings
                                                .filter((b) =>
                                                    b.fieldName.toLowerCase().includes(searchTerm.toLowerCase())
                                                )
                                                .slice(0, 5)
                                                .map((b) => {
                                                    const dynamicStatus = getDynamicStatus(b);
                                                    const statusColor =
                                                        dynamicStatus === "Đang sử dụng"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : dynamicStatus === "Đã sử dụng"
                                                                ? "bg-gray-200 text-gray-700"
                                                                : "bg-green-100 text-green-700";
                                                    return (
                                                        <div
                                                            key={b.id}
                                                            className="p-5 border-2 rounded-xl bg-white hover:shadow-lg transition-all hover:border-blue-300"
                                                        >
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div>
                                                                    <h4 className="font-bold text-lg text-gray-900">
                                                                        {b.fieldName}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-500">
                                                                        {formatDate(b.date)} • {b.timeSlot}
                                                                    </p>
                                                                </div>
                                                                <Badge className={`${statusColor}`}>{dynamicStatus}</Badge>
                                                            </div>
                                                            <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                <span className="text-sm text-gray-600 font-medium">
                                    {formatCurrency(b.price)}
                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                            {/* Nếu ít hơn 5 dòng, chèn khoảng trống để không co */}
                                            {userBookings.length < 5 &&
                                                Array.from({ length: 5 - userBookings.length }).map((_, i) => (
                                                    <div key={`empty-${i}`} className="h-[100px] border-2 border-dashed rounded-xl" />
                                                ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">Chưa có lịch sử đặt sân.</p>
                                    )}
                                </div>

                            </div>
                        ) : (
                            <div className="shadow-lg rounded-xl p-20 text-center">
                                <div className="inline-block p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6">
                                    <Search className="h-16 w-16 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Chọn một khách hàng</h3>
                                <p className="text-gray-600 text-lg">
                                    Chọn khách hàng từ danh sách bên trái để xem chi tiết và lịch sử đặt sân
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                {/* 🔷 Modal xem tất cả lịch sử đặt sân */}
                {showCourtModal && (
                    <CourtHistoryModal
                        bookings={userBookings}
                        onClose={() => setShowCourtModal(false)}
                    />
                )}

                {/* 🔷 Modal xem danh sách khách hàng */}
                {showCustomerModal && (
                    <CustomerListModal
                        users={users}
                        onClose={() => setShowCustomerModal(false)}
                    />
                )}

            </main>
        </div>
    );
};

export default UsersComponent;

