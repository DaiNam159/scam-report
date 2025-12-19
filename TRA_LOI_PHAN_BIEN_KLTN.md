# TRẢ LỜI CÂU HỎI PHẢN BIỆN KHÓA LUẬN

---

## Câu a: Trong quá trình xây dựng hệ thống, quyết định thiết kế nào có ảnh hưởng lớn nhất đến cấu trúc tổng thể của đề tài và vì sao bạn lựa chọn phương án đó?

Quyết định quan trọng nhất là em thiết kế kiến trúc hệ thống theo mô hình 3 lớp, trong đó tách Backend thành 2 phần chuyên biệt.

**Kiến trúc tổng thể:**

- **Frontend (Next.js):** Giao diện web
- **Backend API (NestJS):** Xử lý nghiệp vụ chính (đăng nhập, quản lý báo cáo, danh sách đen)
- **Backend Phân tích (FastAPI - Python):** Phân tích văn bản, so sánh độ giống, gọi API kiểm tra lừa đảo
- **Database (PostgreSQL):** Lưu trữ dữ liệu

**Lý do chọn kiến trúc này:**

Em nhận thấy hệ thống có 2 nhóm công việc khác nhau:

1. Quản lý dữ liệu người dùng, báo cáo (CRUD cơ bản)
2. Phân tích văn bản, gọi nhiều API bên ngoài (xử lý nặng)

Nếu gộp chung 1 backend:

- Khó chọn công nghệ (NestJS giỏi API nhưng Python có nhiều thư viện xử lý văn bản)
- Phần phân tích chậm sẽ làm chậm cả đăng nhập, xem báo cáo
- Khó mở rộng (phải tăng toàn bộ hệ thống)

Tách ra thì:

- Mỗi phần làm việc nó giỏi nhất
- Chỉ cần tăng máy chủ cho phần phân tích khi cần
- Phần phân tích lỗi → user vẫn dùng được các chức năng khác

**Ảnh hưởng đến hệ thống:**

- Database phải thiết kế để 2 backend cùng dùng
- Frontend chỉ gọi Backend API, Backend API sẽ gọi Backend Phân tích khi cần
- Deploy riêng: Frontend (Vercel), Backend API (Render), Backend Phân tích (Render)
- Authentication tập trung ở Backend API

Nhìn lại, em thấy quyết định này đúng vì nhiều lần phần phân tích lỗi nhưng website vẫn chạy bình thường.

---

## Câu b: Nếu hệ thống được triển khai cho quy mô người dùng lớn hơn, theo bạn thành phần nào sẽ trở thành điểm nghẽn đầu tiên và bạn sẽ cải tiến kiến trúc như thế nào để khắc phục?

**Điểm nghẽn:** Backend phân tích văn bản

**Nguyên nhân:**

- Xử lý TF-IDF và cosine similarity tốn CPU (so sánh với hàng nghìn báo cáo cũ)
- Gọi nhiều API bên ngoài tuần tự (VirusTotal, URLScan...) mất 5-8 giây
- User phải chờ đến khi phân tích xong

**Giải pháp:**

1. **Xử lý bất đồng bộ (Message Queue):**

   - User gửi báo cáo → nhận mã số ngay → hệ thống xử lý ngầm
   - Dùng 3-5 workers xử lý song song
   - Thông báo user qua WebSocket khi xong

2. **Cache kết quả (Redis):**

   - Lưu kết quả phân tích URL 24 giờ
   - Người khác báo cáo lại → lấy kết quả cũ
   - Giảm 60-70% lượng phân tích

3. **Tối ưu Database:**

   - Thêm index cho cột hay query
   - Archive báo cáo cũ > 1 năm
   - Thêm Read Replica cho việc đọc

4. **Gọi API song song:**
   - Thay vì gọi tuần tự, gọi đồng thời tất cả API
   - Thời gian = API chậm nhất thay vì tổng thời gian

**Kết quả dự kiến:**

- Hiện tại: 50-100 users, 500 báo cáo/ngày
- Sau cải tiến: 5,000-10,000 users, 20,000-50,000 báo cáo/ngày

## Câu c: Báo cáo chưa có đánh giá định lượng; nếu bổ sung, bạn sẽ chọn những chỉ số nào để đo hiệu quả hoạt động của hệ thống và cách thu thập các chỉ số đó?

Em thấy phần đánh giá định lượng là điểm yếu của báo cáo. Nếu được bổ sung, em sẽ đo lường theo các nhóm chỉ số sau:

### Nhóm 1: Hiệu suất hệ thống

**Các chỉ số em sẽ đo:**

1. **Thời gian phản hồi:**

   - Thời gian tải trang web: mục tiêu < 2 giây
   - API trả về kết quả: mục tiêu < 200ms
   - Phân tích một báo cáo: mục tiêu < 5 giây

2. **Khả năng xử lý:**
   - Số request/giây hệ thống chịu được
   - Số báo cáo xử lý được mỗi ngày
   - Số người dùng cùng lúc

**Cách thu thập:**

Em sẽ viết code ghi log thời gian xử lý mỗi request:

```javascript
// Ghi lại thời gian mỗi API call
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    // Lưu vào database để phân tích sau
    logMetrics({
      endpoint: req.path,
      method: req.method,
      duration_ms: duration,
      timestamp: new Date(),
    });
  });
  next();
});
```

Ngoài ra dùng Google Analytics để đo thời gian tải trang từ phía người dùng.

### Nhóm 2: Độ chính xác phân tích

**Các chỉ số:**

- **Precision (Độ chính xác):** Trong số báo cáo hệ thống nhận định là "lừa đảo", có bao nhiêu % thực sự là lừa đảo

  - Mục tiêu: > 85%

- **Recall (Độ phủ):** Trong tổng số link lừa đảo thật, hệ thống phát hiện được bao nhiêu %
  - Mục tiêu: > 80%

**Cách đo:**

Em sẽ tạo thêm bảng trong database để admin đánh giá:

```sql
CREATE TABLE danh_gia_phan_tich (
  id SERIAL PRIMARY KEY,
  report_id INT REFERENCES reports(id),
  du_doan_he_thong VARCHAR(20),    -- Hệ thống dự đoán: 'lừa đảo' hay 'an toàn'
  ket_qua_thuc_te VARCHAR(20),     -- Admin verify: thực tế có phải lừa đảo không
  do_tin_cay FLOAT,
  ngay_danh_gia TIMESTAMP DEFAULT NOW()
);
```

Quy trình:

1. Hệ thống phân tích và đưa ra dự đoán → lưu vào cột `du_doan_he_thong`
2. Admin review và xác nhận → lưu vào cột `ket_qua_thuc_te`
3. Chạy query tính toán Precision và Recall mỗi tuần
4. Hiển thị kết quả trên dashboard admin

### Nhóm 3: Mức độ sử dụng

**Các chỉ số:**

1. **Người dùng hoạt động:**

   - DAU (số người dùng mỗi ngày)
   - MAU (số người dùng mỗi tháng)
   - Tỷ lệ DAU/MAU để đo độ "dính" của người dùng

2. **Chất lượng báo cáo:**
   - Tỷ lệ báo cáo được admin duyệt (mục tiêu > 70%)
   - Thời gian xử lý một báo cáo (mục tiêu < 48 giờ)
   - Số bằng chứng trung bình mỗi báo cáo

**Cách thu thập:**

Tạo bảng ghi log hoạt động người dùng:

```sql
CREATE TABLE hoat_dong_nguoi_dung (
  user_id INT REFERENCES users(id),
  loai_hoat_dong VARCHAR(50), -- 'đăng nhập', 'gửi báo cáo', 'xem blacklist'
  thoi_gian TIMESTAMP DEFAULT NOW()
);

-- Query số người dùng mỗi ngày
SELECT COUNT(DISTINCT user_id)
FROM hoat_dong_nguoi_dung
WHERE DATE(thoi_gian) = CURRENT_DATE;
```

Với chỉ số chất lượng báo cáo:

```sql
-- Tỷ lệ báo cáo được duyệt
SELECT
  status,
  COUNT(*) as so_luong,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as ty_le_phan_tram
FROM reports
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY status;
```

### Nhóm 4: Độ ổn định

**Các chỉ số:**

- Thời gian hoạt động (Uptime): mục tiêu > 99.5%
- Tỷ lệ lỗi: mục tiêu < 0.5%

**Cách thu thập:**

Tạo endpoint kiểm tra sức khỏe hệ thống:

```javascript
app.get("/health", async (req, res) => {
  // Kiểm tra database
  const dbOk = await checkDatabase();
  // Kiểm tra Redis
  const redisOk = await checkRedis();

  if (dbOk && redisOk) {
    res.status(200).json({ status: "healthy" });
  } else {
    res.status(503).json({ status: "unhealthy" });
  }
});
```

Dùng UptimeRobot hoặc Pingdom để ping endpoint này mỗi 5 phút, ghi lại khi nào hệ thống down.

### Nhóm 5: Tác động thực tế

**Các chỉ số:**

- Tổng số link/email lừa đảo đã phát hiện
- Số lượt người xem danh sách đen (ước tính số người được bảo vệ)
- Tốc độ tăng trưởng người dùng

**Cách thu thập:**

Query đơn giản từ database:

```sql
SELECT
  COUNT(*) as tong_so_bao_cao,
  COUNT(*) FILTER (WHERE status = 'approved') as so_da_duyet,
  SUM(view_count) as tong_luot_xem
FROM reports
WHERE created_at >= NOW() - INTERVAL '30 days';
```

### Công cụ và tự động hóa

**Em sẽ dùng:**

- Google Analytics để đo từ phía người dùng
- Grafana để tạo dashboard hiển thị các metrics
- Cron job chạy mỗi đêm để tính toán và lưu các chỉ số vào bảng riêng
- Sentry để bắt lỗi tự động

**Dashboard mẫu em hình dung:**

```
╔════════════════════════════════════════╗
║ Sức khỏe hệ thống (24h qua)            ║
║ Uptime: 99.8% | Lỗi: 0.2%             ║
║ API: 150ms | Phân tích: 3.2s          ║
╚════════════════════════════════════════╝

╔════════════════════════════════════════╗
║ Độ chính xác (30 ngày qua)             ║
║ Precision: 87% | Recall: 83%          ║
╚════════════════════════════════════════╝

╔════════════════════════════════════════╗
║ Người dùng                             ║
║ Hôm nay: 450 | Tháng này: 3,200      ║
║ Báo cáo hôm nay: 180 | Duyệt: 73%    ║
╚════════════════════════════════════════╝
```

Em nghĩ với các chỉ số này, có thể đánh giá được hiệu quả thực tế của hệ thống và tìm ra điểm cần cải thiện.

---

## TÓM TẮT

**Câu a - Quyết định thiết kế:**  
Em chọn tách backend thành 2 phần (NestJS cho API và FastAPI cho phân tích) vì hệ thống có 2 nhóm công việc khác nhau. Cách này giúp mỗi phần tập trung làm tốt việc của mình, dễ mở rộng sau này, và an toàn hơn khi có lỗi.

**Câu b - Điểm nghẽn:**  
Phần phân tích văn bản sẽ là điểm nghẽn đầu tiên vì xử lý nặng (so sánh văn bản, gọi nhiều API). Em sẽ cải tiến bằng cách: chuyển sang xử lý bất đồng bộ (dùng hàng đợi), lưu cache kết quả đã phân tích, tối ưu database, và gọi API song song. Như vậy có thể tăng từ 500 báo cáo/ngày lên 20,000-50,000 báo cáo/ngày.

**Câu c - Đánh giá định lượng:**  
Em sẽ đo 5 nhóm chỉ số:

1. Hiệu suất (thời gian tải trang, API response)
2. Độ chính xác phân tích (Precision, Recall)
3. Người dùng (DAU, MAU, chất lượng báo cáo)
4. Độ ổn định (Uptime, error rate)
5. Tác động thực tế (số link lừa đảo phát hiện được)

Cách thu thập: viết code log tự động, query database định kỳ, dùng Google Analytics, và các công cụ như UptimeRobot, Sentry. Kết quả hiển thị trên dashboard Grafana.
