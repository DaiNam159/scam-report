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
  { name: "Bộ Công An", logo: "/partner1.png" },
  { name: "Cục ATTT", logo: "/partner2.png" },
  { name: "VNCERT", logo: "/partner3.png" },
  { name: "Bộ TT&TT", logo: "/partner4.png" },
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
    <section className="relative py-20 px-2 text-center overflow-hidden flex flex-col items-center justify-center min-h-[60vh]">
      <div className="absolute inset-0 pointer-events-none select-none opacity-10 bg-[url('/pattern.svg')] bg-repeat" />
      <motion.div
        className="relative z-10 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-[#e53935] mb-6 drop-shadow tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Cảnh Báo & Tra Cứu Lừa Đảo Trực Tuyến
        </motion.h1>
        <motion.p
          className="mb-8 text-xl text-gray-700 md:text-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Nền tảng giúp bạn kiểm tra, cảnh báo, tố cáo các hành vi lừa đảo trên
          môi trường số.
          <br />
          Chung tay xây dựng cộng đồng mạng an toàn, minh bạch!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Link
            href="/tra-cuu"
            className="inline-block bg-gradient-to-r from-[#e53935] to-[#fbc02d] hover:from-[#b71c1c] hover:to-[#fbc02d] text-white font-semibold px-10 py-4 rounded-full text-xl transition shadow-lg animate-bounce"
          >
            Báo cáo lừa đảo ngay
          </Link>
        </motion.div>
      </motion.div>
    </section>

    {/* Stats Section */}
    <section className="max-w-6xl px-2 py-10 mx-auto">
      <div className="flex flex-wrap justify-center gap-10">
        {stats.map((h, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center p-8 transition bg-white border border-gray-100 shadow-lg rounded-2xl w-60 hover:shadow-2xl"
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.div {...pulse}>{h.icon}</motion.div>
            <div className="mt-3 text-3xl font-bold text-black">{h.value}</div>
            <div className="text-base text-gray-600">{h.label}</div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Main Features Section */}
    <section className="px-2 py-20 mx-auto max-w-7xl">
      <h2 className="text-3xl font-bold tracking-tight text-center text-black mb-14">
        Tính năng nổi bật
      </h2>
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
        {mainFeatures.map((f, i) => (
          <motion.div
            key={i}
            className={`relative bg-white border border-gray-100 rounded-3xl shadow-lg p-10 hover:shadow-2xl transition flex flex-col items-center group overflow-hidden`}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            whileHover={{
              scale: 1.07,
              boxShadow: "0 8px 32px 0 rgba(255,0,0,0.10)",
            }}
          >
            <motion.div
              className="mb-2"
              whileHover={{ scale: 1.25, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {f.icon}
            </motion.div>
            <h3 className="font-bold text-xl text-[#e53935] mt-4 mb-2 group-hover:underline">
              {f.title}
            </h3>
            <p className="mb-6 text-base text-gray-700">{f.desc}</p>
            <Link
              href={f.link}
              className="text-[#e53935] font-semibold hover:underline"
            >
              Xem chi tiết
            </Link>
            {/* Hiệu ứng nền động */}
            <motion.div
              className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full ${f.color} opacity-30 blur-2xl`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>

    {/* Why Us Section */}
    <section className="px-2 py-20 bg-gray-50">
      <h2 className="text-3xl font-bold tracking-tight text-center text-black mb-14">
        Vì sao chọn chúng tôi?
      </h2>
      <div className="grid grid-cols-1 gap-12 mx-auto sm:grid-cols-2 md:grid-cols-4 max-w-7xl">
        {whyUs.map((item, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center p-10 transition bg-white shadow-lg rounded-3xl hover:shadow-2xl"
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            whileHover={{ scale: 1.07 }}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {item.icon}
            </motion.div>
            <div className="font-bold text-lg mt-4 mb-2 text-[#e53935]">
              {item.title}
            </div>
            <div className="text-base text-center text-gray-700">
              {item.desc}
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Đối tác & Bảo trợ */}
    <section className="px-2 py-16 bg-white">
      <h2 className="mb-10 text-2xl font-bold tracking-tight text-center text-black">
        Đối tác & Bảo trợ
      </h2>
      <div className="flex flex-wrap items-center justify-center max-w-5xl gap-10 mx-auto">
        {partners.map((p, i) => (
          <div key={i} className="flex flex-col items-center">
            <img
              src={p.logo}
              alt={p.name}
              className="object-contain h-20 transition w-28 grayscale hover:grayscale-0"
            />
            <span className="mt-2 text-sm text-gray-700">{p.name}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Tin tức & cảnh báo mới nhất */}
    <section className="px-2 py-20 bg-white">
      <h2 className="mb-12 text-2xl font-bold tracking-tight text-center text-black">
        Tin tức & Cảnh báo mới nhất
      </h2>
      <div className="flex flex-wrap justify-center max-w-5xl gap-10 mx-auto">
        {news.map((item, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-start p-8 transition border border-gray-100 shadow bg-gray-50 rounded-3xl w-96 hover:shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.7, type: "spring" }}
          >
            <div className="mb-2 text-xs text-gray-500">{item.date}</div>
            <div className="font-bold text-lg text-[#e53935] mb-2">
              {item.title}
            </div>
            <div className="mb-4 text-gray-700">{item.desc}</div>
            <Link
              href={item.link}
              className="text-[#e53935] font-semibold hover:underline mt-auto"
            >
              Đọc chi tiết
            </Link>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Phản hồi người dùng */}
    <section className="px-2 py-20 bg-gray-50">
      <h2 className="mb-12 text-2xl font-bold tracking-tight text-center text-black">
        Người dùng nói gì về chúng tôi?
      </h2>
      <div className="flex flex-wrap justify-center max-w-5xl gap-10 mx-auto">
        {feedbacks.map((fb, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center p-8 transition bg-white border border-gray-100 shadow-lg rounded-3xl w-96 hover:shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.7, type: "spring" }}
          >
            <img
              src={fb.avatar}
              alt={fb.name}
              className="object-cover w-16 h-16 mb-4 border-2 border-red-200 rounded-full"
            />
            <div className="mb-4 italic text-center text-gray-700">
              &quot;{fb.content}&quot;
            </div>
            <div className="font-semibold text-[#e53935]">{fb.name}</div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Hỏi đáp nhanh */}
    <section className="px-2 py-20 bg-white">
      <h2 className="mb-12 text-2xl font-bold tracking-tight text-center text-black">
        Câu hỏi thường gặp
      </h2>
      <div className="flex flex-wrap justify-center max-w-5xl gap-10 mx-auto">
        {faq.map((item, i) => (
          <motion.div
            key={i}
            className="flex flex-col p-8 transition border border-gray-100 shadow bg-gray-50 rounded-3xl w-96 hover:shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.13, duration: 0.7, type: "spring" }}
          >
            <div className="font-semibold text-[#e53935] mb-2">{item.q}</div>
            <div className="text-gray-700">{item.a}</div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Contact Section */}
    <section className="px-2 py-16 text-center bg-gradient-to-r from-red-100 to-white">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-2xl font-bold mb-3 text-[#e53935]">
          Bạn cần hỗ trợ?
        </h2>
        <p className="mb-6 text-lg text-gray-700">
          Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe, hỗ trợ và đồng hành
          cùng bạn trong công cuộc phòng chống lừa đảo trực tuyến.
        </p>
        <Link
          href="/support"
          className="inline-block bg-gradient-to-r from-[#e53935] to-[#fbc02d] hover:from-[#b71c1c] hover:to-[#fbc02d] text-white font-semibold px-10 py-4 rounded-full text-xl transition shadow animate-pulse"
        >
          Liên hệ hỗ trợ
        </Link>
      </motion.div>
    </section>
  </div>
);

export default UserHome;
