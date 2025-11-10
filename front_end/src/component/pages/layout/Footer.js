import React from "react";
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    ArrowRight,
} from "lucide-react";
import {Link} from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-blue-50 text-gray-700">
            {/* Main footer content */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4 ">
                            <Link to="/" className="flex items-center gap-2 bg-gradient-to-r from-blue-900 to-red-600 rounded">
                                <div className=" text-white font-bold text-lg px-2 py-1 rounded">
                                    Tuyên Sơn Sport
                                </div>
                                <img src="/logo/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                            </Link>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            Làng Thể Thao Tuyên Sơn – Điểm Đến Thể Thao Đa Năng Hàng Đầu Tại Đà Nẵng
                        </p>

                        {/* Social Media */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">Theo dõi:</span>
                            {[
                                { icon: Facebook, href: "https://www.facebook.com/tuyensonsport" },
                                { icon: Instagram, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Linkedin, href: "#" },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-200"
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-gray-900 font-semibold mb-4">Hỗ trợ</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Liên hệ", href: "https://www.facebook.com/tuyensonsport" },
                                { label: "Trung tâm trợ giúp", href: "https://www.facebook.com/tuyensonsport" },
                                { label: "Câu hỏi thường gặp", href: "/faq" },
                                { label: "Hướng dẫn sử dụng", href: "/guide" },
                            ].map((item) => (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm block"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h4 className="text-gray-900 font-semibold mb-4">Liên hệ</h4>

                        {/* Contact Info */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="text-xs text-gray-500">Email</div>
                                    <div className="text-sm text-gray-900">
                                        tuyensonsport@support.vn
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="text-xs text-gray-500">Hotline</div>
                                    <div className="text-sm text-gray-900">1900 123 456</div>
                                </div>
                            </div>


                        </div>
                    </div>

                    <div>
                        {/* Thông tin địa chỉ */}
                        <div className="flex items-start gap-3 mb-3">
                            <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                            <div>
                                <div className="text-sm text-gray-900 font-semibold">Địa chỉ</div>
                                <div className="text-xs text-gray-500">
                                    Tuyên Sơn Sport Complex, Đà Nẵng, Vietnam
                                </div>
                            </div>
                        </div>

                        {/* Bản đồ nhỏ + link mở lớn */}
                        <div className="relative rounded-lg overflow-hidden h-48">
                            {/* Bản đồ mini */}
                            <iframe
                                title="Google Maps"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.998437619665!2d108.2268055!3d16.0348176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219e5e599f565%3A0x1e766cbc16295cc2!2sTuyen%20Son%20Sport%20Complex!5e0!3m2!1sen!2s!4v1696152422332!5m2!1sen!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>

                            {/* Nút mở map lớn */}
                            <a
                                href="https://www.google.com/maps/place/Tuyen+Son+Sport+Complex/@16.0348176,108.2268055,17z/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-2 right-2 bg-white text-blue-600 text-xs px-2 py-1 rounded shadow hover:bg-blue-600 hover:text-white transition"
                            >
                                Xem bản đồ lớn
                            </a>
                        </div>
                    </div>


                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-200 bg-white">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <div className="text-gray-600">
                            © {new Date().getFullYear()} -
                            Vietnam
                        </div>

                        <div className="flex items-center gap-6">
                            <a
                                href="/privacy"
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                Chính sách bảo mật
                            </a>
                            <a
                                href="/terms"
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                Điều khoản sử dụng
                            </a>
                            <a
                                href="/sitemap"
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                Sitemap
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
