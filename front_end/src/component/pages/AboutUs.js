export default function AboutUs() {
    return (
        <>
            <section
                className="relative w-full h-[70vh] bg-cover bg-center flex items-center justify-center"
                style={{backgroundImage: "url('/page/stadium.png')"}} // thay bằng đường dẫn ảnh bạn muốn
            >
                <div className="absolute left-1/2 top-[70%] transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-black bg-opacity-40 px-6 py-4 rounded-lg">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center">
                            Tuyên Sơn Sport
                        </h1>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto mt-10">
                <section className="w-full h-[70vh] flex">
                    {/* Ảnh bên trái */}
                    <div className="w-3/5 h-full">
                        <img
                            src="/logo/map2.png"
                            alt="Football"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Mô tả bên phải */}
                    <div className="w-2/5 h-full flex items-center justify-center p-6 bg-gray-50">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Giới thiệu</h2>
                            <ul className="text-gray-700 mb-2">
                                <li>
                                    - Nằm ngay bên cạnh Cung thể thao Tiên Sơn để kết hợp tạo nên sự đa dạng.
                                </li>

                                <li>
                                    - Cung cấp 3 loại sân của 3 bộ môn : bóng đá, tennis và pickleball.
                                </li>
                                <li>
                                    - Hệ thống quản lí hiện đại,nhân viện nhiệt tình thân thiện.
                                </li>
                                <li>
                                    - Hệ thống sân bãi có cả trong nhà và ngoài trời đưa lại sự lựa chọn thoải mái.
                                </li>
                                <li>
                                    - Bãi đậu xe rộng rãi cho cả xe máy và ô tô.
                                </li>
                                <li>
                                    - Căn tin ở ngay trong khuôn viên của làng.sẳn sàng phục vụ nhu cầu của bạn
                                </li>
                                <li>
                                    - Có của hàng cung cấp cho bạn các phụ kiện, đồ thể thao ngay trong làng.
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            <div className="max-w-6xl mx-auto mt-10">
                <section className="w-full h-[70vh] flex">
                    {/* Ảnh bên trái */}

                    {/* Mô tả bên phải */}
                    <div className="w-3/5 h-full flex items-center justify-center p-6 bg-gray-50">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bóng đá </h2>
                            <ul className="text-gray-700 mb-2">
                                <li>
                                    - Sân bóng đá làng thể thao Tuyên Sơn được đầu tư xây dựng gồm cụm 5 sân bóng 7 người với kích thước 30 x 60m và 3 sân bóng 5 người.
                                </li>

                                <li>
                                    - Sân bóng đá được trang bị hệ thống chiếu sáng hiện đại, đảm bảo cung cấp đủ ánh sáng cho các trận đấu vào buổi tối.
                                </li>
                                <li>
                                    - Sân bóng có mặt cỏ khá tốt, độ bám dính tốt, bóng lăn rất đều, độ nảy vừa phải; thoát nước tốt, không bị trơn trượt.
                                </li>
                                <li>
                                    - Với diện tích khá thoải mái, sân thoáng mát phù hợp cho các bạn học sinh, sinh viên hay những đội đá phủi với nhu cầu tìm sân cáp kèo, đá giao hữu hay tập luyện.
                                </li>
                                <li>
                                    - Khu vực khán đài rộng,có mái che cho phép số lượng khán giả cổ vũ lớn và thoải mái
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-2/5 h-full">
                        <img
                            src="/page/football1.png"
                            alt="Football"
                            className="w-full h-full object-cover"
                        />
                    </div>

                </section>
            </div>

            <div className="max-w-6xl mx-auto mt-10">
                <section className="w-full h-[70vh] flex">
                    {/* Ảnh bên trái */}
                    <div className="w-3/5 h-full">
                        <img
                            src="/page/pickleball.png"
                            alt="Football"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Mô tả bên phải */}
                    <div className="w-2/5 h-full flex items-center justify-center p-6 bg-gray-50">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pickle ball</h2>
                            <ul className="text-gray-700 mb-2">
                                <li>
                                    - Sân Pickleball tại Tuyên Sơn được thiết kế ngoài trời, thoáng mát, mặt sân mới sơn xanh mát mắt, tạo cảm giác dễ chịu cho người chơi. Đặc biệt, hệ thống chiếu sáng hiện đại phục vụ tối đa cho các trận đấu vào buổi tối. Ngoài ra, sân còn có khu vực nghỉ ngơi và bãi đậu xe an toàn, giúp bạn hoàn toàn yên tâm tận hưởng những giây phút thể thao.

                                </li>
                                <li>
                                    - Là nơi tổ chức các giải đấu pickle ball lớn top đầu th giới, quy tụ các tay vợt đến tham gia tiêu biểu như : GENERALI-OPEN, PPA TOUR ASIA VIETNAM CUP 2025...
                                </li>
                                <li>
                                   - Pickleball không chỉ giúp bạn giải trí mà còn là cách rèn luyện sức khỏe hiệu quả. Lối chơi nhẹ nhàng nhưng vẫn đầy hấp dẫn, giúp người chơi thư giãn sau những giờ làm việc căng thẳng. Bên cạnh đó, Pickleball còn mang đến cơ hội giao lưu, kết nối với cộng đồng những người chung niềm đam mê.
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            <div className="max-w-6xl mx-auto mt-10">
                <section className="w-full h-[70vh] flex">
                    {/* Ảnh bên trái */}

                    {/* Mô tả bên phải */}
                    <div className="w-3/5 h-full flex items-center justify-center p-6 bg-gray-50">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tennis </h2>
                            <ul className="text-gray-700 mb-2">
                                <li>
                                    - Chúng tôi cung cấp loại mặt sân cơ bản trong tennis đó là sân cứng,gồm các lớp nhựa và cao su.Mặt sân phổ biến với những tay vợt mới và kì cự ở Việt Nam
                                </li>

                                <li>
                                    - Diện tích sân chuẩn theo quy định của Liên đoàn Quần vợt Quốc tế (ITF), cơ quan quản lý quần vợt toàn cầu, một sân tennis thi đấu phải có hình chữ nhật, dài 23,77 mét. Tuy nhiên, chiều rộng sân có sự khác biệt giữa đôi (10,97 mét) và đơn (8,23 mét)..
                                </li>
                                <li>
                                    - Là nơi giao lưu tổ chức thường xuyên của cá giải đấu lớn nhỏ tại Đà Nẵng.
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-2/5 h-full">
                        <img
                            src="/page/tennis.png"
                            alt="Football"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </section>
            </div>
        </>
    );
}