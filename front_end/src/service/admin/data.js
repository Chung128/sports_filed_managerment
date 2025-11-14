
export interface Field {
    id: string;
    name: string;
    type: '5v5' | '7v7' | '11v11';
    pricePerHour: number;
    status: 'available' | 'maintenance';
    image: string;
    description: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalBookings: number;
    totalSpent: number;
    joinedDate: string;
    avatar?: string;
    membershipLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Booking {
    id: string;
    fieldId: string;
    fieldName: string;
    userId: string;
    userName: string;
    userPhone: string;
    date: string;
    timeSlot: string;
    startTime: string;
    endTime: string;
    duration: number;
    price: number;
    status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
    createdAt: string;
    paymentMethod: 'cash' | 'transfer' | 'card';
    notes?: string;
}



export const fields: Field[] = [
    {
        id: '1',
        name: 'Sân 1 - VIP',
        type: '5v5',
        pricePerHour: 350000,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400',
        description: 'Sân cỏ nhân tạo cao cấp, có mái che, đèn chiếu sáng'
    },
    {
        id: '2',
        name: 'Sân 2',
        type: '5v5',
        pricePerHour: 300000,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
        description: 'Sân cỏ nhân tạo tiêu chuẩn, thoáng mát'
    },
    {
        id: '3',
        name: 'Sân 3 - Premium',
        type: '7v7',
        pricePerHour: 550000,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400',
        description: 'Sân 7 người, cỏ nhân tạo Hàn Quốc, có phòng thay đồ'
    },
    {
        id: '4',
        name: 'Sân 4',
        type: '7v7',
        pricePerHour: 500000,
        status: 'maintenance',
        image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400',
        description: 'Đang bảo trì, nâng cấp hệ thống chiếu sáng'
    },
    {
        id: '5',
        name: 'Sân 5 - Sân Lớn',
        type: '11v11',
        pricePerHour: 900000,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
        description: 'Sân 11 người tiêu chuẩn, phù hợp tổ chức giải đấu'
    },
];

export const users: User[] = [
    {
        id: '1',
        name: 'Nguyễn Văn An',
        email: 'nguyenvanan@email.com',
        phone: '0901234567',
        totalBookings: 28,
        totalSpent: 8400000,
        joinedDate: '2024-01-15',
        membershipLevel: 'gold',
    },
    {
        id: '2',
        name: 'Trần Minh Tuấn',
        email: 'tranminhtuan@email.com',
        phone: '0912345678',
        totalBookings: 45,
        totalSpent: 13500000,
        joinedDate: '2023-11-20',
        membershipLevel: 'platinum',
    },
    {
        id: '3',
        name: 'Lê Hoàng Nam',
        email: 'lehoangnam@email.com',
        phone: '0923456789',
        totalBookings: 12,
        totalSpent: 3600000,
        joinedDate: '2024-03-10',
        membershipLevel: 'silver',
    },
    {
        id: '4',
        name: 'Phạm Thị Hương',
        email: 'phamthihuong@email.com',
        phone: '0934567890',
        totalBookings: 19,
        totalSpent: 5700000,
        joinedDate: '2024-01-25',
        membershipLevel: 'gold',
    },
    {
        id: '5',
        name: 'Võ Đức Thắng',
        email: 'voducthang@email.com',
        phone: '0945678901',
        totalBookings: 33,
        totalSpent: 9900000,
        joinedDate: '2023-12-05',
        membershipLevel: 'gold',
    },
    {
        id: '6',
        name: 'Hoàng Minh Quân',
        email: 'hoangminhquan@email.com',
        phone: '0956789012',
        totalBookings: 8,
        totalSpent: 2400000,
        joinedDate: '2024-04-15',
        membershipLevel: 'bronze',
    },
];

const generateBookingsForDate = (date: string, count: number): Booking[] => {
    const bookings: Booking[] = [];
    const timeSlots = [
        { start: '06:00', end: '07:30' },
        { start: '07:30', end: '09:00' },
        { start: '09:00', end: '10:30' },
        { start: '16:00', end: '17:30' },
        { start: '17:30', end: '19:00' },
        { start: '19:00', end: '20:30' },
        { start: '20:30', end: '22:00' },
    ];

    for (let i = 0; i < count; i++) {
        const field = fields[Math.floor(Math.random() * fields.length)];
        const user = users[Math.floor(Math.random() * users.length)];
        const slot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        const duration = 1.5;

        bookings.push({
            id: `booking-${date}-${i}`,
            fieldId: field.id,
            fieldName: field.name,
            userId: user.id,
            userName: user.name,
            userPhone: user.phone,
            date: date,
            timeSlot: `${slot.start} - ${slot.end}`,
            startTime: slot.start,
            endTime: slot.end,
            duration: duration,
            price: field.pricePerHour * duration,
            status: new Date(date) < new Date() ? 'completed' : 'confirmed',
            createdAt: date,
            paymentMethod: ['cash', 'transfer', 'card'][Math.floor(Math.random() * 3)],
        });
    }

    return bookings;
};

export const bookings: Booking[] = [
    ...generateBookingsForDate('2024-12-15', 8),
    ...generateBookingsForDate('2024-12-16', 11),
    ...generateBookingsForDate('2024-12-17', 9),
    ...generateBookingsForDate('2024-12-18', 13),
    ...generateBookingsForDate('2024-12-19', 12),
    ...generateBookingsForDate('2024-12-20', 15),
    ...generateBookingsForDate('2024-12-21', 14),
    ...generateBookingsForDate('2024-12-22', 10),
    ...generateBookingsForDate('2024-12-23', 16),
];


export const timeSlots = [
    '05:30', '06:30', '07:30', '08:30', '09:30',
     '10:30', '11:30', '12:30', '13:30',
     '14:30',  '15:30',  '16:30','17:30',
    '18:30', '19:30',  '20:30',  '21:30'
];