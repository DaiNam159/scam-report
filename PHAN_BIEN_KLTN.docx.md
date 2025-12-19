# PHẦN TRẢ LỜI CÂU HỎI PHẢN BIỆN KHÓA LUẬN TỐT NGHIỆP

**Đề tài:** Thiết kế và xây dựng hệ thống website cảnh báo và theo dõi thông tin lừa đảo trực tuyến

---

## Câu a: Quyết định thiết kế có ảnh hưởng lớn nhất đến cấu trúc tổng thể

### Quyết định: Kiến trúc Microservices với Backend phân tách theo chức năng

**Mô tả quyết định:**
Hệ thống được thiết kế theo mô hình Microservices với 2 backend độc lập:

- **Backend API (NestJS):** Xử lý nghiệp vụ chính (quản lý người dùng, báo cáo, xác thực, CRUD operations)
- **Backend AI (FastAPI):** Chuyên xử lý các tác vụ phân tích nâng cao (AI detection, similarity analysis, pattern matching)
- **Frontend (Next.js):** Giao diện người dùng với SSR/SSG

**Lý do lựa chọn phương án này:**

1. **Tách biệt trách nhiệm (Separation of Concerns)**

   - Backend API tập trung vào business logic, authentication, database operations
   - Backend AI tập trung vào machine learning, data analysis, heavy computation
   - Mỗi service có thể phát triển, test, và deploy độc lập

2. **Tối ưu hóa công nghệ cho từng mục đích**

   - NestJS (TypeScript): Phù hợp cho RESTful API, type-safe, ORM (TypeORM), validation mạnh
   - FastAPI (Python): Ecosystem AI/ML phong phú (scikit-learn, transformers, pandas), xử lý dữ liệu nhanh
   - Mỗi service sử dụng ngôn ngữ và framework tốt nhất cho domain của nó

3. **Khả năng mở rộng (Scalability)**

   - Backend AI (tính toán nặng) có thể scale độc lập khi load tăng
   - Backend API (I/O intensive) có thể scale khác với AI service
   - Tránh tình trạng một service làm chậm toàn bộ hệ thống

4. **Fault Isolation**

   - Nếu AI service gặp sự cố (model crash, timeout), API vẫn hoạt động bình thường
   - Có thể fallback sang phương pháp phân tích đơn giản hơn khi AI service down

5. **Tích hợp API bên thứ 3 linh hoạt**
   - Backend API gọi multiple external APIs (VirusTotal, URLScan, Google Safe Browsing, IPQS)
   - Backend AI xử lý kết quả từ các API này và đưa ra phân tích tổng hợp
   - Dễ dàng thêm/thay đổi API providers mà không ảnh hưởng service khác

**Ảnh hưởng đến cấu trúc tổng thể:**

- Database được thiết kế với normalized schema để phục vụ cả 2 backends
- Communication giữa services qua REST API (có thể nâng cấp sang gRPC nếu cần tốc độ cao hơn)
- Frontend chỉ giao tiếp với Backend API, Backend API sẽ gọi Backend AI khi cần
- Deployment độc lập: Frontend (Vercel), Backend API (Render), Backend AI (có thể deploy riêng)

**Phương án thay thế đã xem xét:**

- **Monolithic architecture:** Đơn giản hơn nhưng khó scale, mixing concerns, khó maintain khi hệ thống lớn
- **Serverless functions:** Chi phí cao cho AI tasks, cold start làm chậm response time
- **All-in-one Backend:** Python hoặc Node.js thuần - không tận dụng được ưu điểm của cả 2 ecosystems

---

## Câu b: Điểm nghẽn khi scale và cải tiến kiến trúc

### Phân tích các điểm nghẽn tiềm năng:

#### 1. **Backend AI - Điểm nghẽn đầu tiên (HIGH PRIORITY)**

**Nguyên nhân:**

- Các tác vụ AI (similarity analysis, content scanning) là CPU-intensive
- Mỗi request phân tích có thể mất 2-5 giây
- Gọi multiple external APIs đồng thời (VirusTotal, URLScan, etc.) - I/O blocking
- Không có caching cho kết quả phân tích

**Giải pháp cải tiến:**

a) **Implement Message Queue System (RabbitMQ/Redis Queue)**

```
User Request → Backend API → Enqueue Job → Return Job ID
                                ↓
                          AI Worker Pool ← Process Jobs
                                ↓
                          Update Database → Notify User (WebSocket/Polling)
```

- Chuyển từ synchronous sang asynchronous processing
- User không phải chờ kết quả phân tích (3-5s) → nhận ngay Job ID
- Multiple AI workers có thể xử lý parallel

b) **Caching Strategy**

- **Redis Cache** cho kết quả phân tích URL/email đã scan
- Cache TTL: 24h cho URLs, 7 days cho domains
- Giảm 60-70% API calls cho các báo cáo trùng lặp
- Example: URL https://example.com/scam đã được scan → cache kết quả

c) **Rate Limiting và Throttling**

- Limit external API calls: 100 requests/minute
- Priority queue: Admin/verified users > Free users
- Batch processing cho multiple URLs cùng domain

#### 2. **Database - Điểm nghẽn thứ hai**

**Nguyên nhân:**

- Bảng `reports` tăng nhanh (1000+ reports/day)
- Complex queries với JOIN nhiều bảng (reports + user + blacklist + evidence)
- Full-text search trên description không được index tối ưu

**Giải pháp:**

a) **Database Indexing**

```sql
-- Index cho queries thường xuyên
CREATE INDEX idx_reports_status ON reports(status, created_at);
CREATE INDEX idx_reports_user ON reports(user_id, created_at);
CREATE INDEX idx_blacklist_type ON user_blacklist(blacklist_type, value);

-- Full-text search index
CREATE INDEX idx_reports_description_fts ON reports
USING gin(to_tsvector('english', description));
```

b) **Database Sharding theo thời gian**

- Partition bảng reports theo tháng
- Archive reports cũ hơn 12 tháng sang cold storage (S3)
- Hot data: 3 months recent → Main DB
- Warm data: 3-12 months → Read replica
- Cold data: >12 months → Archive DB

c) **Read Replicas**

- Master DB: Write operations
- 2-3 Read Replicas: Queries từ public users, analytics
- Connection pooling: max 100 connections

#### 3. **Frontend - Static Assets và API Calls**

**Giải pháp:**

- CDN (Cloudflare/Vercel Edge) cho images, CSS, JS
- Image optimization với next/image và Cloudinary transformations
- API Response caching với SWR/React Query
- Debounce search inputs (500ms delay)

#### 4. **External API Rate Limits**

**Giải pháp:**

- API Gateway pattern để manage rate limits
- Fallback strategies khi API quota exceeded
- Local ML models (TensorFlow.js) cho basic phishing detection

### Kiến trúc cải tiến tổng thể:

```
                    ┌─────────────────┐
                    │   CDN (Vercel)  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Next.js App   │
                    │   (Frontend)    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  API Gateway    │
                    │ (Rate Limiting) │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼─────┐      ┌─────▼──────┐     ┌─────▼─────┐
    │ Backend  │      │   Redis    │     │  Message  │
    │   API    │◄─────┤   Cache    │     │   Queue   │
    │ (NestJS) │      └────────────┘     └─────┬─────┘
    └────┬─────┘                               │
         │                                      │
         │                              ┌───────▼──────┐
         │                              │  AI Workers  │
         │                              │  Pool (3-5)  │
         │                              └───────┬──────┘
         │                                      │
    ┌────▼──────────────────────────────────────▼─────┐
    │            PostgreSQL Cluster                   │
    │  Master (Write) + Read Replicas (2-3 nodes)    │
    └─────────────────────────────────────────────────┘
```

### Chiến lược Scale:

**Horizontal Scaling:**

- Backend API: 3-5 instances (Kubernetes/Docker)
- AI Workers: 5-10 workers tùy load
- Database: Read replicas tăng theo traffic

**Vertical Scaling:**

- Database Master: 8 CPU, 32GB RAM
- AI Workers: 4 CPU, 16GB RAM per worker
- Backend API: 2 CPU, 4GB RAM per instance

**Estimated capacity:**

- Current: ~100 concurrent users, ~500 reports/day
- After optimization: ~10,000 concurrent users, ~50,000 reports/day

---

## Câu c: Chỉ số đánh giá định lượng và cách thu thập

### Nhóm 1: Performance Metrics (Hiệu suất hệ thống)

#### 1.1. Response Time

**Chỉ số:**

- Average API Response Time: < 200ms (90th percentile)
- Page Load Time: < 2s (First Contentful Paint)
- AI Analysis Time: < 5s per report

**Cách thu thập:**

```javascript
// Backend - Middleware logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration_ms: duration,
      timestamp: new Date().toISOString(),
    });
  });
  next();
});
```

**Tools:**

- Application Performance Monitoring (APM): New Relic, DataDog
- Custom logging pipeline: Winston → Elasticsearch → Kibana
- Frontend: Google Analytics, Vercel Analytics

#### 1.2. Throughput

**Chỉ số:**

- Requests per second (RPS): Target 1000 RPS
- Reports processed per day
- Concurrent users: Target 500 concurrent

**Cách thu thập:**

- Nginx/Load Balancer access logs
- Database query: `SELECT COUNT(*) FROM reports WHERE created_at >= NOW() - INTERVAL '1 day'`
- Real-time metrics dashboard

### Nhóm 2: Accuracy Metrics (Độ chính xác)

#### 2.1. Detection Accuracy

**Chỉ số:**

- Precision: TP / (TP + FP) - Target > 85%
- Recall: TP / (TP + FN) - Target > 80%
- F1-Score: 2 × (Precision × Recall) / (Precision + Recall) - Target > 82%

**Định nghĩa:**

- True Positive (TP): Phát hiện đúng scam
- False Positive (FP): Báo nhầm website hợp lệ là scam
- False Negative (FN): Bỏ sót website scam

**Cách thu thập:**

```sql
-- Create evaluation table
CREATE TABLE detection_evaluation (
  id SERIAL PRIMARY KEY,
  report_id INT REFERENCES reports(id),
  system_prediction VARCHAR(20), -- 'scam' or 'legitimate'
  admin_verification VARCHAR(20), -- Ground truth
  evaluated_at TIMESTAMP,
  confidence_score FLOAT
);

-- Calculate metrics
SELECT
  SUM(CASE WHEN system_prediction = 'scam' AND admin_verification = 'scam' THEN 1 ELSE 0 END) as true_positive,
  SUM(CASE WHEN system_prediction = 'scam' AND admin_verification = 'legitimate' THEN 1 ELSE 0 END) as false_positive,
  SUM(CASE WHEN system_prediction = 'legitimate' AND admin_verification = 'scam' THEN 1 ELSE 0 END) as false_negative
FROM detection_evaluation
WHERE evaluated_at >= NOW() - INTERVAL '30 days';
```

#### 2.2. Blacklist Match Rate

**Chỉ số:**

- % báo cáo trùng với blacklist existing: Target 40-50%
- False positive rate trên blacklist: < 5%

**Cách thu thập:**

```sql
SELECT
  COUNT(*) FILTER (WHERE blacklist_match = TRUE) * 100.0 / COUNT(*) as match_rate
FROM reports
WHERE created_at >= NOW() - INTERVAL '7 days';
```

### Nhóm 3: User Engagement Metrics

#### 3.1. User Activity

**Chỉ số:**

- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- DAU/MAU Ratio (Stickiness): Target > 20%
- Average reports per user: Target 2-3/month

**Cách thu thập:**

```sql
-- DAU
SELECT COUNT(DISTINCT user_id)
FROM user_activity_logs
WHERE DATE(activity_at) = CURRENT_DATE;

-- MAU
SELECT COUNT(DISTINCT user_id)
FROM user_activity_logs
WHERE activity_at >= NOW() - INTERVAL '30 days';

-- Reports per user
SELECT
  AVG(report_count) as avg_reports_per_user
FROM (
  SELECT user_id, COUNT(*) as report_count
  FROM reports
  WHERE created_at >= NOW() - INTERVAL '30 days'
  GROUP BY user_id
) subquery;
```

#### 3.2. Report Quality

**Chỉ số:**

- % báo cáo được admin approved: Target > 70%
- Average evidence per report: Target > 1.5
- Time to resolution: Target < 48h

**Cách thu thập:**

```sql
-- Approval rate
SELECT
  status,
  COUNT(*) as count,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage
FROM reports
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY status;

-- Time to resolution
SELECT
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_hours_to_resolve
FROM reports
WHERE status IN ('approved', 'rejected')
  AND created_at >= NOW() - INTERVAL '30 days';
```

### Nhóm 4: System Health Metrics

#### 4.1. Availability

**Chỉ số:**

- Uptime: Target > 99.5% (43.8 hours downtime/year)
- Error Rate: < 0.5% of requests
- Success Rate: > 99.5%

**Cách thu thập:**

- Uptime monitoring: UptimeRobot, Pingdom
- Health check endpoint: `/health` returning 200 OK

```javascript
app.get("/health", async (req, res) => {
  const dbStatus = await checkDatabase();
  const redisStatus = await checkRedis();
  const aiServiceStatus = await checkAIService();

  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: { dbStatus, redisStatus, aiServiceStatus },
  });
});
```

#### 4.2. Resource Utilization

**Chỉ số:**

- CPU Usage: Target < 70% average
- Memory Usage: Target < 80%
- Database connections: Target < 80% of pool size
- Disk I/O: Monitor IOPS

**Cách thu thập:**

- Infrastructure monitoring: Prometheus + Grafana
- Docker stats: `docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemPerc}}"`
- Cloud provider metrics: Render, AWS CloudWatch

### Nhóm 5: Business Metrics

#### 5.1. Impact Metrics

**Chỉ số:**

- Total scam reports in database
- Unique scam domains/emails blocked
- Estimated users protected (views on blacklist items)
- Community contribution rate: % reports from verified users

**Cách thu thập:**

```sql
-- Dashboard queries
SELECT
  COUNT(*) as total_reports,
  COUNT(DISTINCT blacklist_id) as unique_threats,
  SUM(view_count) as total_views_protected
FROM reports
WHERE status = 'approved';
```

#### 5.2. Growth Metrics

**Chỉ số:**

- Week-over-week user growth: Target > 5%
- Month-over-month report growth
- Retention rate: % users returning after 30 days

### Implementation Plan cho Monitoring System:

```yaml
# Monitoring Stack
components:
  - name: Application Metrics
    tool: Prometheus + Grafana
    data: API response times, request rates, error rates

  - name: Log Aggregation
    tool: ELK Stack (Elasticsearch, Logstash, Kibana)
    data: Application logs, error traces, user activities

  - name: Database Monitoring
    tool: pgAdmin + custom queries
    data: Query performance, connection pool, table sizes

  - name: Frontend Analytics
    tool: Google Analytics 4 + Vercel Analytics
    data: User behavior, page views, conversion funnels

  - name: Alerting
    tool: PagerDuty / Slack webhooks
    triggers:
      - Error rate > 1%
      - Response time > 1s (95th percentile)
      - Uptime < 99%
      - Database connections > 90%
```

### Sample Dashboard Layout:

**Real-time Operations Dashboard:**

```
┌─────────────────────────────────────────────────────┐
│  System Health                                      │
│  ● API Status: 🟢 Healthy (198ms avg)              │
│  ● AI Service: 🟢 Healthy (2.3s avg)               │
│  ● Database: 🟢 Healthy (45ms query time)          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Performance (Last 24h)                             │
│  📊 RPS: 142 avg, 890 peak                         │
│  ⏱️ Response Time: p50=120ms, p95=450ms            │
│  ❌ Error Rate: 0.3%                               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Business Metrics (Last 30 days)                    │
│  📝 Reports: 12,450 (+15% vs prev month)           │
│  👥 Active Users: 3,200 (DAU: 450)                 │
│  ✅ Approval Rate: 73%                             │
│  ⏰ Avg Resolution Time: 32 hours                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  AI Performance                                     │
│  🎯 Precision: 87%                                 │
│  📍 Recall: 82%                                    │
│  ⚡ F1-Score: 84.5%                               │
└─────────────────────────────────────────────────────┘
```

---

## Kết luận

Hệ thống đã được thiết kế với kiến trúc microservices phù hợp, có khả năng mở rộng tốt. Các điểm nghẽn chính đã được xác định và có phương án cải tiến cụ thể. Việc bổ sung các chỉ số đánh giá định lượng sẽ giúp đo lường hiệu quả hoạt động một cách khoa học, từ đó có cơ sở để tối ưu hóa và phát triển hệ thống trong tương lai.

Các giải pháp đề xuất đều dựa trên best practices trong ngành và có thể triển khai thực tế với chi phí hợp lý, phù hợp với quy mô dự án khóa luận tốt nghiệp.
