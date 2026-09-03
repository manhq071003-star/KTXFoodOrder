# 🛵 KTX FoodExpress - Hệ Thống Đặt Đồ Ăn KTX Thông Minh

**KTX FoodExpress** là ứng dụng web hỗ trợ sinh viên KTX đặt món ăn, trà sữa giao nhanh tận phòng, đồng thời hỗ trợ nhà bếp KTX quản lý đơn hàng, thực đơn và thống kê doanh thu thực tế.

---

## 🚀 Tính Năng Nổi Bật

### 🎓 Dành cho Sinh Viên (`index.html`)
- **Menu & Gợi ý thông minh:** Tự động gợi ý món ăn theo khung giờ (Sáng: Bánh mì/Phở; Trưa-Tối: Cơm/Bún; Đêm: Trà sữa/Ăn vặt).
- **Vòng quay may mắn Canvas:** Xoay bánh xe nhận Voucher giảm giá tự động lưu vào **Kho Voucher Của Tôi**.
- **Bản đồ Shipper Tracker Real-time:** Theo dõi mô phỏng vị trí xe Shipper di chuyển trực quan từ Bếp -> Cổng KTX -> Phòng Sinh viên.
- **Xác thực OTP & Đồng hồ đếm ngược:** Đơn hàng tự động sinh mã OTP 4 số xác nhận khi nhận món và đếm ngược thời gian giao 15 phút.
- **Tùy chọn Topping & Ví Sinh Viên:** Tự động cộng tiền topping khi chọn món, hỗ trợ thanh toán qua Ví KTX, VietQR hoặc Tiền mặt.

### 🍳 Dành cho Nhà Bếp / Admin (`admin.html`)
- **Quản lý Thực đơn (CRUD):** Thêm món mới, Bật/Tắt trạng thái hết hàng, Sửa đơn giá trực tiếp trên giao diện Admin.
- **Thống kê Doanh thu Real-time:** Tự động tích lũy tổng doanh thu và hiển thị biểu đồ danh sách các món ăn bán chạy nhất.
- **Âm thanh Chuông Báo Đơn Mới:** Tự động phát tiếng chuông thông báo ngay khi có sinh viên chốt đơn.

---

## 🛠️ Công Nghệ Sử Dụng

- **Backend:** Java (HTTP Server nhúng), JDBC, SQLite Database.
- **Frontend:** HTML5, CSS3 (Flexbox/Grid, Dark Mode), JavaScript ES6+ (Canvas API, Web Audio API, LocalStorage).
- **Database:** SQLite (`ktx_food_express.db`) - Tự động khởi tạo dữ liệu mẫu, không cần cài đặt phần mềm CSDL bên ngoài.

---

## 📋 Hướng Dẫn Chạy Dự Án

### Yêu cầu môi trường:
- Java JDK 17 trở lên.
- IntelliJ IDEA, Eclipse, VS Code hoặc Maven.

### Các bước khởi động:
1. **Mở dự án:** Nạp dự án vào IntelliJ IDEA (hoặc IDE tương đương).
2. **Chạy Server Backend:** 
   - Mở file `backend/src/main/java/Main.java`.
   - Bấm nút **Run** (hoặc tổ hợp phím `Shift + F10`).
   - Server sẽ tự động mở tại đường dẫn `http://localhost:8080` và khởi tạo file SQLite DB.
3. **Mở Trang Web Frontend:**
   - Mở trình duyệt web bất kỳ và truy cập: `http://localhost:8080/index.html` (hoặc click đúp trực tiếp file `frontend/index.html`).
   - Mở trang Admin quản lý bếp tại: `http://localhost:8080/admin.html` (hoặc click đúp file `frontend/admin.html`).

---

## 🔑 Tài Khoản Dùng Thử
- **Mã Sinh Viên (MSSV):** `SV001` (Số dư sẵn: 250.000 VNĐ) hoặc `SV002` (Số dư sẵn: 180.000 VNĐ).
