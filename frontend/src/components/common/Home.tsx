"use client";
import Link from "next/link";
import {
  ShieldAlert,
  Ban,
  FileText,
  Lightbulb,
  Users,
  CheckCircle2,
  Star,
  Handshake,
  MessageCircle,
  Award,
  Globe2,
} from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, type: "spring" },
  }),
};

const pulse = {
  animate: {
    scale: [1, 1.08, 1],
    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
  },
};

const mainFeatures = [
  {
    icon: <ShieldAlert className="w-10 h-10 text-[#e53935]" />,
    title: "Báo cáo lừa đảo",
    desc: "Gửi tố cáo các vụ việc lừa đảo, giúp cộng đồng cảnh giác và phòng tránh.",
    link: "/tra-cuu",
    color: "from-[#e53935] to-[#ffb300]",
  },
  {
    icon: <Ban className="w-10 h-10 text-[#222]" />,
    title: "Danh sách đen",
    desc: "Tổng hợp tài khoản, số điện thoại, website... đã bị báo cáo lừa đảo nhiều lần.",
    link: "/danh-sach-den",
    color: "from-[#222] to-[#757575]",
  },
  {
    icon: <FileText className="w-10 h-10 text-[#fbc02d]" />,
    title: "Tin tức & Cảnh báo",
    desc: "Cập nhật các thủ đoạn lừa đảo mới, cảnh báo nóng từ cộng đồng và chuyên gia.",
    link: "/tin-tuc",
    color: "from-[#fbc02d] to-[#fffde7]",
  },
  {
    icon: <Lightbulb className="w-10 h-10 text-[#1565c0]" />,
    title: "Kiến thức an toàn số",
    desc: "Cẩm nang, hướng dẫn nhận biết và phòng tránh lừa đảo trên môi trường số.",
    link: "/kien-thuc",
    color: "from-[#1565c0] to-[#e3f2fd]",
  },
];

const stats = [
  {
    icon: <ShieldAlert className="w-8 h-8 text-[#e53935]" />,
    label: "Vụ việc đã báo cáo",
    value: "15,200+",
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-[#1565c0]" />,
    label: "Cảnh báo gửi đi",
    value: "8,500+",
  },
  {
    icon: <Award className="w-8 h-8 text-[#fbc02d]" />,
    label: "Cá nhân/tổ chức vinh danh",
    value: "120+",
  },
  {
    icon: <Globe2 className="w-8 h-8 text-[#388e3c]" />,
    label: "Tỉnh/thành đã có cộng đồng",
    value: "63/63",
  },
];

const whyUs = [
  {
    icon: <CheckCircle2 className="w-7 h-7 text-[#e53935]" />,
    title: "Độ tin cậy cao",
    desc: "Dữ liệu xác thực, cập nhật liên tục từ cộng đồng và chuyên gia.",
  },
  {
    icon: <Users className="w-7 h-7 text-[#e53935]" />,
    title: "Cộng đồng lớn mạnh",
    desc: "Hàng ngàn người dùng cùng chung tay xây dựng môi trường mạng an toàn.",
  },
  {
    icon: <Star className="w-7 h-7 text-[#fbc02d]" />,
    title: "Hỗ trợ tận tâm",
    desc: "Đội ngũ hỗ trợ luôn sẵn sàng giải đáp, tiếp nhận và xử lý tố cáo.",
  },
  {
    icon: <Handshake className="w-7 h-7 text-[#1565c0]" />,
    title: "Kết nối đa chiều",
    desc: "Liên kết các tổ chức, chuyên gia, cộng đồng để lan tỏa giá trị tích cực.",
  },
];

const partners = [
  { name: "Bộ Công An", logo: "/logo-bca.png" },
  { name: "Cục ATTT", logo: "/logo-attt.png" },
  { name: "VNCERT", logo: "/logo-ttccmt.png" },
  { name: "Bộ TT&TT", logo: "/logo-tttt.jpg" },
];

const feedbacks = [
  {
    name: "Nguyễn Văn A",
    avatar: "/avatar1.jpg",
    content:
      "Trang web giúp tôi phát hiện và tránh được nhiều vụ lừa đảo tinh vi. Giao diện dễ dùng, thông tin cập nhật nhanh.",
  },
  {
    name: "Trần Thị B",
    avatar: "/avatar2.jpg",
    content:
      "Tôi đã báo cáo thành công một vụ lừa đảo, đội ngũ hỗ trợ phản hồi rất nhanh và tận tình.",
  },
  {
    name: "Lê Văn C",
    avatar: "/avatar3.jpg",
    content:
      "Kho kiến thức rất hữu ích, giúp tôi và gia đình cảnh giác hơn khi giao dịch online.",
  },
];

const news = [
  {
    title: "Cảnh báo lừa đảo giả mạo ngân hàng",
    date: "01/06/2024",
    desc: "Nhiều đối tượng giả danh nhân viên ngân hàng gọi điện, gửi tin nhắn yêu cầu cung cấp OTP, thông tin tài khoản.",
    link: "/news/1",
  },
  {
    title: "Thủ đoạn lừa đảo đầu tư tài chính đa cấp",
    date: "28/05/2024",
    desc: "Các sàn đầu tư tài chính ảo, đa cấp biến tướng tiếp tục lừa đảo nhiều người dân với chiêu trò lợi nhuận cao.",
    link: "/news/2",
  },
  {
    title: "Cảnh giác với tin nhắn trúng thưởng",
    date: "25/05/2024",
    desc: "Nhiều người nhận được tin nhắn trúng thưởng, yêu cầu đóng phí nhận quà, thực chất là lừa đảo.",
    link: "/news/3",
  },
];

const faq = [
  {
    q: "Làm sao để nhận biết một website lừa đảo?",
    a: "Kiểm tra kỹ địa chỉ website, dấu hiệu bất thường, không cung cấp thông tin cá nhân/OTP khi chưa xác thực nguồn gốc.",
  },
  {
    q: "Tôi bị lừa đảo thì nên làm gì?",
    a: "Báo cáo ngay trên nền tảng, liên hệ ngân hàng/nhà mạng để khóa tài khoản, đồng thời trình báo cơ quan chức năng.",
  },
  {
    q: "Báo cáo của tôi có được bảo mật không?",
    a: "Chúng tôi cam kết bảo mật thông tin người báo cáo, chỉ sử dụng cho mục đích xác minh và cảnh báo cộng đồng.",
  },
];

const UserHome = () => (
  <div className="bg-gradient-to-b from-white via-red-50 to-white">
    {/* Hero Section */}
    <section className="relative py-8 sm:py-12 lg:py-20 px-3 sm:px-6 lg:px-8 text-center overflow-hidden flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[50vh] lg:min-h-[60vh]">
      <div className="absolute inset-0 pointer-events-none select-none opacity-10 bg-[url('/pattern.avif')] bg-repeat" />
      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#e53935] mb-3 sm:mb-4 lg:mb-6 drop-shadow tracking-tight leading-tight px-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Cảnh Báo & Tra Cứu
          <br className="block sm:hidden" />
          Lừa Đảo Trực Tuyến
        </motion.h1>
        <motion.p
          className="px-2 mb-4 text-sm leading-relaxed text-gray-700 sm:mb-6 lg:mb-8 sm:text-base md:text-lg lg:text-xl xl:text-2xl sm:px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Nền tảng giúp bạn kiểm tra, cảnh báo, tố cáo các hành vi lừa đảo trên
          môi trường số.
          <br className="hidden sm:block" />
          Chung tay xây dựng cộng đồng mạng an toàn, minh bạch!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Link
            href="/tra-cuu"
            className="inline-block bg-gradient-to-r from-[#e53935] to-[#fbc02d] hover:from-[#b71c1c] hover:to-[#fbc02d] text-white font-semibold px-4 sm:px-6 lg:px-10 py-2.5 sm:py-3 lg:py-4 rounded-full text-base sm:text-lg lg:text-xl transition shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
          >
            Báo cáo lừa đảo ngay
          </Link>
        </motion.div>
      </motion.div>
    </section>

    {/* Stats Section */}
    <section className="max-w-6xl px-3 py-8 mx-auto sm:px-6 lg:px-8 sm:py-10 lg:py-16">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-6 lg:gap-10">
        {stats.map((h, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center p-3 transition bg-white border border-gray-100 shadow-lg sm:p-4 lg:p-8 rounded-xl sm:rounded-2xl hover:shadow-2xl"
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.div {...pulse} className="mb-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8">
                {React.cloneElement(h.icon, {
                  className: "w-full h-full text-[#e53935]",
                })}
              </div>
            </motion.div>
            <div className="mt-1 text-lg font-bold text-black sm:mt-2 sm:text-xl lg:text-2xl xl:text-3xl">
              {h.value}
            </div>
            <div className="text-xs leading-tight text-center text-gray-600 sm:text-sm lg:text-base">
              {h.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Main Features Section */}
    <section className="px-3 py-6 mx-auto sm:px-6 lg:px-8 sm:py-8 lg:py-16 max-w-7xl">
      <h2 className="px-2 mb-4 text-lg font-bold tracking-tight text-center text-black sm:text-xl lg:text-2xl sm:mb-6 lg:mb-8">
        Tính năng nổi bật
      </h2>

      {/* Mobile: 2 columns, Desktop: 4 columns */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        {mainFeatures.map((f, i) => (
          <motion.div
            key={i}
            className={`relative bg-white border border-gray-100 rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300 flex flex-col items-center group overflow-hidden`}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 20px 0 rgba(255,0,0,0.08)",
            }}
          >
            {/* Icon */}
            <motion.div
              className="mb-2 sm:mb-3"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10">
                {React.cloneElement(f.icon, {
                  className: "w-full h-full text-[#e53935]",
                })}
              </div>
            </motion.div>

            {/* Title */}
            <h3 className="font-bold text-xs sm:text-sm lg:text-base text-[#e53935] mb-1 sm:mb-2 text-center leading-tight line-clamp-2">
              {f.title}
            </h3>

            {/* Description - Hide on mobile, show on larger screens */}
            <p className="flex-grow hidden mb-2 text-xs leading-relaxed text-center text-gray-600 sm:block lg:text-sm lg:mb-3 line-clamp-3">
              {f.desc}
            </p>

            {/* Link */}
            <Link
              href={f.link}
              className="text-[#e53935] font-semibold hover:underline text-xs sm:text-sm mt-auto"
            >
              <span className="sm:hidden">Xem</span>
              <span className="hidden sm:inline">Xem chi tiết</span>
            </Link>

            {/* Background Effect - Smaller on mobile */}
            <motion.div
              className={`absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 lg:-bottom-10 lg:-right-10 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full ${f.color} opacity-20 sm:opacity-30 blur-xl sm:blur-2xl`}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Mobile Description Cards - Show only on mobile */}
      <div className="grid grid-cols-1 gap-3 mt-4 sm:hidden">
        {mainFeatures.map((f, i) => (
          <div
            key={`desc-${i}`}
            className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                {React.cloneElement(f.icon, {
                  className: "w-full h-full text-[#e53935]",
                })}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-[#e53935] mb-1">
                  {f.title}
                </h4>
                <p className="text-xs leading-relaxed text-gray-600">
                  {f.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Why Us Section */}
    <section className="px-3 py-6 sm:px-6 lg:px-8 sm:py-8 lg:py-16 bg-gray-50">
      <h2 className="px-2 mb-4 text-lg font-bold tracking-tight text-center text-black sm:text-xl lg:text-2xl sm:mb-6 lg:mb-8">
        Vì sao chọn chúng tôi?
      </h2>

      {/* Mobile: 2 columns, Desktop: 4 columns */}
      <div className="grid grid-cols-2 gap-3 mx-auto sm:gap-4 lg:grid-cols-4 lg:gap-6 max-w-7xl">
        {whyUs.map((item, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center p-3 transition bg-white shadow-md sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl hover:shadow-lg"
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
          >
            {/* Icon */}
            <motion.div
              whileHover={{ scale: 1.15, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mb-2 sm:mb-3"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7">
                {React.cloneElement(item.icon, {
                  className: "w-full h-full text-[#e53935]",
                })}
              </div>
            </motion.div>

            {/* Title */}
            <div className="font-bold text-xs sm:text-sm lg:text-base mb-1 sm:mb-2 text-[#e53935] text-center leading-tight">
              {item.title}
            </div>

            {/* Description */}
            <div className="text-xs leading-relaxed text-center text-gray-700 sm:text-sm lg:text-base line-clamp-3">
              {item.desc}
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Đối tác & Bảo trợ */}
    <section className="px-3 py-6 bg-white sm:px-6 lg:px-8 sm:py-8 lg:py-12">
      <h2 className="px-2 mb-4 text-base font-bold tracking-tight text-center text-black sm:mb-6 lg:mb-8 sm:text-lg lg:text-xl">
        Đối tác & Bảo trợ
      </h2>
      <div className="grid items-center max-w-5xl grid-cols-2 gap-3 mx-auto sm:grid-cols-4 sm:gap-4 lg:gap-6 justify-items-center">
        {partners.map((p, i) => (
          <div key={i} className="flex flex-col items-center group">
            <div className="flex items-center justify-center w-10 h-10 transition bg-gray-100 rounded-lg sm:w-12 sm:h-12 lg:w-16 lg:h-16 grayscale hover:grayscale-0 group-hover:scale-105">
              <Image
                src={p.logo}
                alt={p.name}
                width={48}
                height={48}
                className="object-contain w-full h-full p-1"
              />
            </div>
            <span className="mt-1 text-xs font-medium text-center text-gray-700 sm:text-sm sm:mt-2">
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </section>

    {/* Tin tức & cảnh báo mới nhất */}
    <section className="px-3 py-6 bg-white sm:px-6 lg:px-8 sm:py-8 lg:py-16">
      <h2 className="px-2 mb-4 text-base font-bold tracking-tight text-center text-black sm:mb-6 lg:mb-8 sm:text-lg lg:text-xl">
        Tin tức & Cảnh báo mới nhất
      </h2>
      <div className="grid max-w-5xl grid-cols-1 gap-3 mx-auto sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 lg:gap-6">
        {news.map((item, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-start p-3 transition border border-gray-100 shadow-sm sm:p-4 lg:p-5 bg-gray-50 rounded-xl sm:rounded-2xl hover:shadow-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, type: "spring" }}
          >
            <div className="mb-1 text-xs font-medium text-gray-500 sm:mb-2">
              {item.date}
            </div>
            <div className="font-bold text-sm sm:text-base text-[#e53935] mb-1 sm:mb-2 leading-tight line-clamp-2">
              {item.title}
            </div>
            <div className="flex-grow mb-2 text-xs leading-relaxed text-gray-700 sm:text-sm sm:mb-3 line-clamp-3">
              {item.desc}
            </div>
            <Link
              href={item.link}
              className="text-[#e53935] font-semibold hover:underline text-xs sm:text-sm mt-auto"
            >
              Đọc chi tiết
            </Link>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Phản hồi người dùng */}
    <section className="px-3 py-8 sm:px-6 lg:px-8 sm:py-12 lg:py-20 bg-gray-50">
      <h2 className="px-4 mb-6 text-lg font-bold tracking-tight text-center text-black sm:mb-8 lg:mb-12 sm:text-xl lg:text-2xl">
        Người dùng nói gì về chúng tôi?
      </h2>
      <div className="grid max-w-5xl grid-cols-1 gap-4 mx-auto sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-10">
        {feedbacks.map((fb, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center p-4 sm:p-6 lg:p-8 transition bg-white border border-gray-100 shadow-lg rounded-2xl sm:rounded-3xl hover:shadow-2xl min-h-[200px] sm:min-h-[220px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.7, type: "spring" }}
          >
            <div className="flex items-center justify-center w-12 h-12 mb-3 text-sm font-bold text-white border-2 border-red-200 rounded-full sm:w-14 sm:h-14 lg:w-16 lg:h-16 sm:mb-4 bg-gradient-to-br from-red-400 to-orange-500 sm:text-base lg:text-lg">
              {fb.name.charAt(0)}
            </div>
            <div className="flex-grow mb-3 text-xs italic leading-relaxed text-center text-gray-700 sm:mb-4 sm:text-sm lg:text-base">
              &quot;{fb.content}&quot;
            </div>
            <div className="font-semibold text-[#e53935] text-xs sm:text-sm lg:text-base mt-auto">
              {fb.name}
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Hỏi đáp nhanh */}
    <section className="px-3 py-8 bg-white sm:px-6 lg:px-8 sm:py-12 lg:py-20">
      <h2 className="px-4 mb-6 text-lg font-bold tracking-tight text-center text-black sm:mb-8 lg:mb-12 sm:text-xl lg:text-2xl">
        Câu hỏi thường gặp
      </h2>
      <div className="grid max-w-5xl grid-cols-1 gap-4 mx-auto lg:grid-cols-2 xl:grid-cols-3 sm:gap-6 lg:gap-10">
        {faq.map((item, i) => (
          <motion.div
            key={i}
            className="flex flex-col p-4 sm:p-6 lg:p-8 transition border border-gray-100 shadow bg-gray-50 rounded-2xl sm:rounded-3xl hover:shadow-xl min-h-[140px] sm:min-h-[160px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.13, duration: 0.7, type: "spring" }}
          >
            <div className="font-semibold text-[#e53935] mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base leading-tight">
              {item.q}
            </div>
            <div className="flex-grow text-xs leading-relaxed text-gray-700 sm:text-sm lg:text-base">
              {item.a}
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Contact Section */}
    <section className="px-3 py-8 text-center sm:px-6 lg:px-8 sm:py-12 lg:py-16 bg-gradient-to-r from-red-100 to-white">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-[#e53935] px-4">
          Bạn cần hỗ trợ?
        </h2>
        <p className="px-4 mb-4 text-sm leading-relaxed text-gray-700 sm:mb-6 sm:text-base lg:text-lg">
          Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe, hỗ trợ và đồng hành
          cùng bạn trong công cuộc phòng chống lừa đảo trực tuyến.
        </p>
        <Link
          href="/ho-tro"
          className="inline-block bg-gradient-to-r from-[#e53935] to-[#fbc02d] hover:from-[#b71c1c] hover:to-[#fbc02d] text-white font-semibold px-4 sm:px-6 lg:px-10 py-2.5 sm:py-3 lg:py-4 rounded-full text-sm sm:text-base lg:text-xl transition shadow hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
        >
          Liên hệ hỗ trợ
        </Link>
      </motion.div>
    </section>
  </div>
);

export default UserHome;
