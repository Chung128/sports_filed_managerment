// import React, { useState, useEffect } from "react";
// // Thêm useNavigate, Link để xử lý chuyển hướng và toast
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { getCurrentUser } from "../../service/login/authApi"; // Import hàm lấy user
//
// import AOS from "aos";
// import "aos/dist/aos.css";
// // Giả định đường dẫn và cấu trúc file đúng
// import { images } from "../../service/slider";
// import { Phone, Clock, LayoutGrid, Users, Zap } from "lucide-react";
//
// export default function Home() {
//     const navigate = useNavigate();
//     const [user, setUser] = useState(null); // State để lưu thông tin user
//
//     // --- Logic Fetch User (Tương tự Navbar) ---
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const userData = await getCurrentUser();
//                 // Chỉ cần kiểm tra xem có dữ liệu user hợp lệ không
//                 setUser(userData);
//             } catch (err) {
//                 setUser(null);
//             }
//         };
//
//         fetchData();
//
//         // Khởi tạo AOS
//         AOS.init({ duration: 1000, once: true });
//     }, []);
//
//     // --- HÀM XỬ LÝ CLICK ĐẶT SÂN (QUAN TRỌNG) ---
//     const handleBookingClick = (e) => {
//         // Kiểm tra nếu user chưa đăng nhập (user là null hoặc không hợp lệ)
//         if (!user) {
//             e.preventDefault(); // Ngăn hành vi mặc định của thẻ <a>
//             toast.error("Vui lòng đăng nhập để tiến hành đặt sân!");
//             navigate("/login"); // Chuyển hướng đến trang Đăng nhập
//         }
//         // Nếu user đã đăng nhập, không làm gì cả, thẻ <a> sẽ chuyển hướng đến /booking
//     };
//
//
//     // Logic Slider
//     const [currentIndex, setCurrentIndex] = useState(0);
//
//     // Auto slide (5s)
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
//         }, 5000);
//         return () => clearInterval(interval);
//     }, [currentIndex]);
//
//     const handlePrev = () => {
//         setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//     };
//
//     const handleNext = () => {
//         setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
//     };
//
//     const goToSlide = (slideIndex) => {
//         setCurrentIndex(slideIndex);
//     };
//
//     // Dữ liệu cho phần "Làng thể thao Tuyên Sơn"
//     const features = [
//         {
//             title: "Khung giờ linh hoạt",
//             desc: "Trung tâm thể thao hoạt động từ 6h00 sáng đến 22h00 đêm, cho phép bạn lựa chọn khung giờ phù hợp nhất để tập luyện.",
//             icon: <Clock className="w-6 h-6" />,
//         },
//         {
//             title: "Đa dạng môn thể thao",
//             desc: "Nhiều môn thể thao khác nhau, hệ thống sân bãi hiện đại với kích thước chuẩn, đa dạng lựa chọn trải nghiệm.",
//             icon: <LayoutGrid className="w-6 h-6" />,
//         },
//         {
//             title: "Giao lưu & Kết nối",
//             desc: "Là nơi lý tưởng để bạn giải trí, gặp gỡ bạn bè và có những khoảnh khắc thể thao ấn tượng cùng những người chung đam mê.",
//             icon: <Users className="w-6 h-6" />,
//         },
//         {
//             title: "Dịch vụ nhanh chóng",
//             desc: "Đội ngũ nhân viên chuyên nghiệp, đông đảo, luôn sẵn sàng hỗ trợ thắc mắc và yêu cầu của bạn một cách nhanh chóng nhất.",
//             icon: <Zap className="w-6 h-6" />,
//         },
//     ];
//
//     return (
//         <>
//             {/* 1. SLIDER SECTION */}
//             <section className="relative w-full aspect-video md:aspect-[16/7] lg:aspect-[16/6] max-h-[90vh] mx-auto overflow-hidden shadow-2xl">
//                 {/* Slider container */}
//                 <div
//                     className="flex h-full transition-transform duration-1000 ease-in-out"
//                     style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//                 >
//                     {images.map((src, index) => (
//                         <img
//                             key={index}
//                             src={src}
//                             className="w-full h-full object-cover flex-shrink-0"
//                             alt={`slide-${index + 1}`}
//                             loading="lazy"
//                         />
//                     ))}
//                 </div>
//
//                 {/* Nút Prev */}
//                 <button
//                     onClick={handlePrev}
//                     aria-label="Previous slide"
//                     className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 md:p-4 rounded-lg hover:bg-white/40 transition-all duration-300 shadow-xl opacity-80 hover:opacity-100 focus:outline-none focus:ring-4 focus:ring-white/50 z-10"
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
//                     </svg>
//                 </button>
//
//                 {/* Nút Next */}
//                 <button
//                     onClick={handleNext}
//                     aria-label="Next slide"
//                     className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 md:p-4 rounded-lg hover:bg-white/40 transition-all duration-300 shadow-xl opacity-80 hover:opacity-100 focus:outline-none focus:ring-4 focus:ring-white/50 z-10"
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
//                     </svg>
//                 </button>
//
//                 {/* Dot Indicators */}
//                 <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
//                     {images.map((_, index) => (
//                         <button
//                             key={index}
//                             onClick={() => goToSlide(index)}
//                             aria-label={`Go to slide ${index + 1}`}
//                             className={`h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${
//                                 currentIndex === index ? 'bg-white w-8' : 'bg-white/50 w-3 hover:bg-white/80'
//                             }`}
//                         />
//                     ))}
//                 </div>
//             </section>
//
//             {/* 2. INTRO SECTION (Làng thể thao Tuyên Sơn) */}
//             <section
//                 className="relative bg-white pb-28 pt-20 overflow-hidden"
//                 data-aos="fade-up"
//             >
//                 {/* Decorative background pattern (Optional) */}
//                 <div className="absolute inset-0 bg-blue-50/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,#f0f8ff)]"></div>
//
//
//                 <div className="container mx-auto px-6 text-center relative z-10">
//                     <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
//                         Chào mừng đến với <span className="text-blue-600">Làng Thể Thao Tuyên Sơn</span>
//                     </h2>
//                     <div className="w-24 h-1.5 bg-blue-600 mx-auto mb-10 rounded-full"></div>
//
//                     <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-16 leading-relaxed">
//                         "Điểm đến lý tưởng cho những ai yêu thích vận động và chăm sóc sức khỏe. Với cơ sở vật chất hiện đại, đội ngũ huấn luyện viên tận tâm và đa dạng bộ môn, chúng tôi cam kết mang đến cho bạn trải nghiệm rèn luyện thể chất toàn diện."
//                     </p>
//
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
//                         {features.map((item, index) => (
//                             <div
//                                 key={index}
//                                 data-aos="zoom-in"
//                                 data-aos-delay={index * 150}
//                                 className="bg-white p-8 rounded-xl border border-blue-200 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 relative transform group"
//                             >
//                                 {/* Icon nổi bật hơn */}
//                                 <div
//                                     className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center text-3xl mb-4 shadow-blue-500/50 shadow-lg group-hover:bg-blue-700 transition"
//                                 >
//                                     {item.icon}
//                                 </div>
//                                 <h3 className="text-xl font-bold mt-4 mb-3 text-gray-900">
//                                     {item.title}
//                                 </h3>
//                                 <p className="text-gray-600 leading-relaxed text-base">{item.desc}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>
//
//
//             {/* 3. CTA SECTION (Kêu gọi hành động) */}
//             <section
//                 className="relative overflow-hidden py-28 text-white text-center bg-blue-600"
//                 data-aos="zoom-in"
//             >
//                 {/* Decorative overlay */}
//                 <div className="absolute inset-0 bg-black/10"></div>
//
//                 {/* Content layer */}
//                 <div className="relative z-10 container mx-auto px-6 max-w-3xl">
//                     <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow-md">
//                         Bạn đã sẵn sàng cho trải nghiệm thể thao đỉnh cao?
//                     </h2>
//                     <p className="text-lg md:text-xl mb-12 opacity-90">
//                         Liên hệ ngay để đặt trước sân và bắt đầu hành trình nâng cao sức khỏe của bạn!
//                     </p>
//                     <div className="mt-12 text-center">
//                         {/* THAY THẾ a bằng Link và thêm onClick để kiểm tra đăng nhập */}
//                         <a
//                             href="/booking"
//                             // ÁP DỤNG HÀM XỬ LÝ CLICK TẠI ĐÂY
//                             onClick={handleBookingClick}
//                             className="inline-flex items-center justify-center gap-4 px-12 py-4 bg-yellow-400 text-gray-900 font-extrabold text-lg rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-yellow-300 focus:ring-4 focus:ring-yellow-500/50"
//                         >
//                             <Phone className="w-6 h-6" />  ĐẶT SÂN NGAY
//                         </a>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    Phone,
    Clock,
    LayoutGrid,
    Users,
    Zap,
    MapPin,
    Star,
    CheckCircle2,
    ArrowRight,
    Calendar,
    Trophy,
    Shield
} from "lucide-react";
import {images} from "../../service/slider";
import {getCurrentUser} from "../../service/user/login/authApi";

export default function Index() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (err) {
                setUser(null);
            }
        };

        fetchData();
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);


    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const sports = [
        {
            name: "Bóng Đá",
            icon: "⚽",
            desc: "Sân cỏ nhân tạo cao cấp, đạt chuẩn quốc tế",
            image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
            features: ["Sân 5 người", "Sân 7 người", "Sân 11 người", "Đèn chiếu sáng"]
        },
        {
            name: "Tennis",
            icon: "🎾",
            desc: "Mặt sân chuyên nghiệp, thiết bị hiện đại",
            image: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=600&q=80",
            features: ["Sân đơn", "Sân đôi", "Huấn luyện viên", "Cho thuê vợt"]
        },
        {
            name: "Pickleball",
            icon: "🏓",
            desc: "Môn thể thao mới, dễ chơi, phù hợp mọi lứa tuổi",
            image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80",
            features: ["4 sân chuẩn", "Thiết bị đầy đủ", "Hướng dẫn miễn phí", "Giải đấu"]
        }
    ];

    const features = [
        {
            title: "Khung giờ linh hoạt",
            desc: "Hoạt động từ 5h00 sáng đến 23h00 đêm, phù hợp mọi lịch trình của bạn",
            icon: <Clock className="w-7 h-7" />,
            color: "from-blue-500 to-cyan-500"
        },
        {
            title: "Đa dạng môn thể thao",
            desc: "3 môn thể thao phổ biến với hệ thống sân bãi hiện đại, kích thước chuẩn",
            icon: <LayoutGrid className="w-7 h-7" />,
            color: "from-purple-500 to-pink-500"
        },
        {
            title: "Giao lưu & Kết nối",
            desc: "Nơi lý tưởng để gặp gỡ, giao lưu với những người chung đam mê thể thao",
            icon: <Users className="w-7 h-7" />,
            color: "from-orange-500 to-red-500"
        },
        {
            title: "Dịch vụ chuyên nghiệp",
            desc: "Đội ngũ nhân viên tận tâm, hỗ trợ 24/7, đảm bảo trải nghiệm tốt nhất",
            icon: <Zap className="w-7 h-7" />,
            color: "from-green-500 to-emerald-500"
        }
    ];

    const stats = [
        { number: "50+", label: "Sân thể thao", icon: <Trophy className="w-6 h-6" /> },
        { number: "10,000+", label: "Khách hàng", icon: <Users className="w-6 h-6" /> },
        { number: "5★", label: "Đánh giá", icon: <Star className="w-6 h-6" /> },
        { number: "24/7", label: "Hỗ trợ", icon: <Shield className="w-6 h-6" /> }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

            {/* HERO SLIDER SECTION */}
            <section className="relative w-full h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
                {/* Slider container */}
                <div
                    className="flex h-full transition-transform duration-1000 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((src, index) => (
                        <div key={index} className="relative w-full h-full flex-shrink-0">
                            <img
                                src={src}
                                className="w-full h-full object-cover"
                                alt={`slide-${index + 1}`}
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        </div>
                    ))}
                </div>

                {/* Hero Content Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center text-white px-6 max-w-5xl" data-aos="fade-up">
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight drop-shadow-2xl">
                            Làng Thể Thao
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Tuyên Sơn
              </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-gray-100 font-medium drop-shadow-lg">
                            Trải nghiệm thể thao đẳng cấp với Bóng Đá • Tennis • Pickleball
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a
                                href="/booking"
                                className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
                            >
                                <Calendar className="w-6 h-6" />
                                Đặt sân ngay
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="#sports"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md text-white font-bold text-lg rounded-full border-2 border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300"
                            >
                                <LayoutGrid className="w-6 h-6" />
                                Khám phá
                            </a>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={handlePrev}
                    aria-label="Previous slide"
                    className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/20 transition-all duration-300 shadow-xl z-20 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 group-hover:-translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <button
                    onClick={handleNext}
                    aria-label="Next slide"
                    className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/20 transition-all duration-300 shadow-xl z-20 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 group-hover:translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                currentIndex === index
                                    ? 'bg-white w-12 shadow-lg'
                                    : 'bg-white/40 w-2 hover:bg-white/60'
                            }`}
                        />
                    ))}
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                className="text-center group"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl md:text-5xl font-black mb-2">{stat.number}</div>
                                <div className="text-blue-100 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SPORTS SECTION */}
            <section id="sports" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
                            Các Môn Thể Thao
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-6 rounded-full"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Trải nghiệm 3 môn thể thao phổ biến với cơ sở vật chất hiện đại nhất
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {sports.map((sport, index) => (
                            <div
                                key={index}
                                data-aos="zoom-in"
                                data-aos-delay={index * 150}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={sport.image}
                                        alt={sport.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="text-5xl mb-2">{sport.icon}</div>
                                        <h3 className="text-3xl font-black text-white">{sport.name}</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 mb-4 text-lg">{sport.desc}</p>
                                    <ul className="space-y-2">
                                        {sport.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-gray-700">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
                            Tại Sao Chọn Chúng Tôi?
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto mb-6 rounded-full"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Cam kết mang đến trải nghiệm thể thao tốt nhất cho bạn
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((item, index) => (
                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                            >
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`}></div>
                                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=80')] opacity-10 bg-cover bg-center"></div>

                <div className="relative z-10 container mx-auto px-6 text-center" data-aos="zoom-in">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight drop-shadow-lg">
                        Sẵn Sàng Cho Trải Nghiệm Thể Thao Đỉnh Cao?
                    </h2>
                    <p className="text-xl md:text-2xl mb-12 text-blue-50 max-w-3xl mx-auto">
                        Đặt sân ngay hôm nay và nhận ưu đãi đặc biệt cho lần đầu tiên!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                        <a
                            href="/booking"
                            className="group inline-flex items-center gap-3 px-12 py-5 bg-white text-blue-600 font-black text-lg rounded-full shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all duration-300"
                        >
                            <Calendar className="w-6 h-6" />
                            Đặt sân ngay
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>

                        <a
                            href="tel:0123456789"
                            className="inline-flex items-center gap-3 px-12 py-5 bg-white/10 backdrop-blur-md text-white font-bold text-lg rounded-full border-2 border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300"
                        >
                            <Phone className="w-6 h-6" />
                            0123 456 789
                        </a>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 text-white">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span className="font-medium">Tuyên Sơn,Đà Nẵng, Việt Nam</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium">5:30 - 22:30 hàng ngày</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}