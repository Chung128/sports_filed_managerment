import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, MapPin, Search, Filter } from 'lucide-react';
import {bookings} from "../../../service/admin/data";

const Bookings = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const filteredBookings = bookings.filter((b) => {
        const matchesSearch =
            b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.userPhone.includes(searchTerm) ||
            b.fieldName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
        const matchesDate = dateFilter === 'all' || b.date === dateFilter;

        return matchesSearch && matchesStatus && matchesDate;
    });

    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const uniqueDates = Array.from(new Set(bookings.map((b) => b.date))).sort().reverse();

    // Thay Badge
    const getStatusBadge = (status) => {
        const variants = {
            confirmed: 'bg-blue-500 text-white',
            completed: 'bg-green-500 text-white',
            cancelled: 'bg-red-500 text-white',
            pending: 'bg-yellow-500 text-white',
        };
        const labels = {
            confirmed: 'Đã Xác Nhận',
            completed: 'Hoàn Thành',
            cancelled: 'Đã Hủy',
            pending: 'Chờ Xác Nhận',
        };
        const style = variants[status] || variants.confirmed;
        return <span className={`px-2 py-1 rounded ${style} text-sm`}>{labels[status]}</span>;
    };

    const getPaymentBadge = (method) => {
        const labels = { cash: 'Tiền mặt', transfer: 'Chuyển khoản', card: 'Thẻ' };
        return <span className="px-2 py-1 rounded border text-sm">{labels[method]}</span>;
    };

    return (
        <div className="flex flex-col h-full w-full p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 z-10 gap-4 border-b bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Quản Lý Đặt Sân
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200 text-green-700 font-semibold">
                    {filteredBookings.length} đơn đặt
                </div>
            </div>

            {/* Filters */}
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 space-y-4">
                <div className="flex flex-col md:flex-row md:gap-4">
                    <div className="relative w-full md:w-1/3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm theo tên, SĐT, sân..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border p-2 rounded w-full"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border p-2 rounded w-full md:w-1/3"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                        <option value="pending">Chờ xác nhận</option>
                    </select>

                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="border p-2 rounded w-full md:w-1/3"
                    >
                        <option value="all">Tất cả ngày</option>
                        {uniqueDates.map((d) => (
                            <option key={d} value={d}>
                                {formatDate(d)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
                <div className="text-center text-gray-500 mt-6">Không tìm thấy đơn đặt sân</div>
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map((b) => (
                        <div
                            key={b.id}
                            className="bg-white shadow-md rounded-lg border-l-4 border-green-500 p-6 flex flex-col lg:flex-row justify-between gap-4"
                        >
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-green-600" size={24} />
                                    <div>
                                        <h3 className="text-xl font-bold">{b.fieldName}</h3>
                                        <p className="text-sm text-gray-500">Mã đơn: #{b.id}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {getStatusBadge(b.status)}
                                    {getPaymentBadge(b.paymentMethod)}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                        <User size={18} className="text-gray-400" />
                                        <span>{b.userName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                        <Phone size={18} className="text-gray-400" />
                                        <span>{b.userPhone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                        <Calendar size={18} className="text-gray-400" />
                                        <span>{formatDate(b.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                        <Clock size={18} className="text-gray-400" />
                                        <span>{b.timeSlot}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:text-right lg:border-l lg:pl-6 lg:ml-6">
                                <div className="inline-block p-4 bg-green-50 rounded-xl border border-green-200">
                                    <p className="text-sm text-gray-600 mb-1">Tổng tiền</p>
                                    <div className="text-2xl font-bold text-green-600">{formatCurrency(b.price)}</div>
                                    <p className="text-sm text-gray-500 mt-2">{b.duration} giờ</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookings;
