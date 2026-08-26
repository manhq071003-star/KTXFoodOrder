# KTXFoodOrder — Hệ Thống Đặt Đồ Ăn Cho Sinh Viên KTX

Dự án Bài tập lớn Lập trình hướng đối tượng (Java OOP) thiết kế theo mô hình **Web Application REST API 3 tầng** (Backend Java REST API, Frontend HTML/CSS/JS, Mock Database JSON qua thư viện Gson).

---

## 📌 1. Kiến Trúc Hệ Thống (3 Tầng Tách Biệt)

* **Tầng Frontend (`frontend/`):** Giao diện Web (HTML/CSS/JS) gửi HTTP Request (REST API) và hiển thị dữ liệu JSON.
* **Tầng Backend REST API (`backend/src/`):**
  * `handler`: Tiếp nhận HTTP Request từ Web, gọi Service và trả về JSON Response.
  * `service`: Xử lý logic nghiệp vụ, áp dụng tính Đa hình (Polymorphism) thanh toán.
  * `repository`: Thao tác đọc/ghi file `.json` trực tiếp thông qua thư viện Gson.
  * `model`: Chứa các lớp đối tượng OOP (Encapsulation, Inheritance).
  * `utils`: Tiện ích hệ thống, sinh mã tự động & xử lý ngoại lệ (Custom Exceptions).
* **Tầng Mock Database (`backend/data/`):** Lưu trữ dữ liệu dạng file `.json`.

---

## ⚙️ 2. Quy Tắc Nghiệp Vụ (5 Business Rules)

1. **Món hết hàng:** Ngăn chặn chọn các món ăn có `isAvailable = false`.
2. **Số lượng hợp lệ:** Bắt buộc số lượng món chọn đặt phải $\ge 1$.
3. **Số dư tài khoản:** Ném ngoại lệ `InsufficientBalanceException` nếu ví sinh viên không đủ tiền thanh toán.
4. **Giỏ hàng rỗng:** Ngăn tạo hoặc xác nhận đơn hàng khi chưa có món trong giỏ.
5. **Giá tiền hợp lệ:** Chặn lập trình hoặc nhập dữ liệu món ăn có giá $< 0$.

---

## 📂 3. Cấu Trúc Cây Thư Mục Dự Án

```text
KTXFoodOrder/
├── backend/                             # TẦNG BACKEND (JAVA REST API)
│   ├── data/                            # Mock Database JSON
│   │   ├── foods.json                   # Dữ liệu món ăn
│   │   ├── orders.json                  # Dữ liệu đơn hàng
│   │   └── students.json                # Dữ liệu sinh viên & ví
│   └── src/
│       ├── handler/                     # REST Handlers (Food, Order, Student)
│       ├── main/                        # Khởi chạy HTTP Web Server
│       ├── model/                       # Models OOP (User, Student, Food, Cart, Order...)
│       ├── repository/                  # File JSON IO via Gson
│       ├── service/                     # Business Services & Payment Polymorphism
│       └── utils/                       # Custom Exceptions, CodeGenerator & Validation Utils
│
└── frontend/                            # TẦNG FRONTEND (GIAO DIỆN WEB)
    ├── app.js                           # Logic Fetch REST API & DOM Rendering
    ├── index.html                       # Giao diện ứng dụng
    └── style.css                        # Định dạng CSS
