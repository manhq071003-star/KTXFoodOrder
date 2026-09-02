# 🍳 KTXFoodOrder — Hệ Thống Đặt Đồ Ăn Sinh Viên KTX

![Java](https://img.shields.io/badge/JAVA-17%2B-orange?style=for-the-badge&logo=java)
![Architecture](https://img.shields.io/badge/ARCHITECTURE-3--TIER%20REST%20API-blue?style=for-the-badge)
![Frontend](https://img.shields.io/badge/FRONTEND-HTML5%20%7C%20CSS3%20%7C%20JS-yellow?style=for-the-badge)
![Database](https://img.shields.io/badge/DATABASE-MOCK%20JSON%20VIA%20GSON-green?style=for-the-badge)

Dự án Bài tập lớn Lập trình hướng đối tượng (Java OOP) được xây dựng theo mô hình **Web Application REST API 3 tầng chuẩn hóa**. Hệ thống quản lý toàn bộ luồng đặt món, tính tiền, trừ ví sinh viên, chuyển khoản, thanh toán tiền mặt và lưu trữ lịch sử đơn hàng tự động bằng cơ chế đọc/ghi file JSON.

---

## 📌 1. Kiến Trúc Hệ Thống (3-Tier Architecture)

Dự án tuân thủ nguyên tắc **Separation of Concerns (SoC)** và **Dependency Direction (Phụ thuộc 1 chiều)**:
`Frontend Web (HTML/JS) ➔ REST Handlers ➔ Business Services ➔ Repositories ➔ Mock JSON Database`

* **Frontend (`frontend/`):** Giao diện người dùng tương tác dạng Modern Dashboard SPA (Single Page Application), xử lý `fetch()` API bất đồng bộ và render DOM linh hoạt.
* **Backend REST API (`backend/src/`):**
  * `handler`: Tiếp nhận HTTP Request (`GET`, `POST`, `DELETE`), trích xuất tham số và phản hồi dữ liệu chuẩn `JSON` kèm theo CORS Header.
  * `service`: Chứa toàn bộ Logic nghiệp vụ, xử lý Đa hình (Polymorphism) trong thanh toán (`PaymentMethod`), quản lý giỏ hàng và kiểm soát Exception.
  * `repository`: Thực hiện thao tác CRUD đọc/ghi trực tiếp xuống Database file `.json` qua thư viện `Gson`.
  * `model`: Đóng gói đối tượng OOP (Encapsulation, Inheritance với `User` ➔ `Student`).
  * `utils`: Bộ công cụ sinh mã đơn hàng, Validate dữ liệu đầu vào và tập hợp Custom Exceptions.
* **Mock Database (`backend/data/`):** Lưu trữ dữ liệu hệ thống dưới dạng file JSON tĩnh (`foods.json`, `students.json`, `orders.json`).

---

## 🌐 2. Danh Sách REST API Endpoints

| HTTP Method | API Endpoint | Tầng Backend Xử Lý | Chức Năng Trên Giao Diện Web |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/students/{id}` | `StudentHandler` | Lấy thông tin sinh viên, phòng KTX và số dư ví hiển thị trên Header Card. |
| **GET** | `/api/foods` | `FoodHandler` | Lấy toàn bộ thực đơn món ăn render dạng Product Cards UI. |
| **GET** | `/api/foods?search={kw}` | `FoodHandler` | Tìm kiếm món ăn theo tên không phân biệt hoa/thường. |
| **GET** | `/api/cart?studentId={id}` | `CartHandler` | Lấy danh sách món ăn hiện có trong giỏ hàng và tổng tiền tạm tính. |
| **POST** | `/api/cart` | `CartHandler` | Thêm món ăn vào giỏ hàng hoặc cập nhật số lượng món. |
| **DELETE** | `/api/cart?studentId={id}&foodId={id}` | `CartHandler` | Xóa món ăn khỏi giỏ hàng. |
| **POST** | `/api/orders` | `OrderHandler` | Gửi giỏ hàng, kiểm tra Business Rules, trừ tiền/thanh toán & khởi tạo đơn hàng. |
| **GET** | `/api/orders` | `OrderHandler` | Lấy toàn bộ danh sách lịch sử đơn hàng đã lưu trong hệ thống. |
| **GET** | `/api/payments` | `PaymentHandler` | Lấy danh sách các phương thức thanh toán khả dụng. |

---

## ⚙️ 3. Quy Tắc Nghiệp Vụ (5 Business Rules)

1. **R1 — Ngăn đặt món hết hàng:** Khóa chọn các món ăn đang có trạng thái `isAvailable = false`.
2. **R2 — Validate số lượng:** Bắt buộc số lượng món đặt mua phải $\ge 1$.
3. **R3 — Kiểm tra số dư ví:** Ném ngoại lệ `InsufficientBalanceException` nếu số dư ví sinh viên không đủ chi trả tổng đơn khi chọn thanh toán bằng ví.
4. **R4 — Chặn giỏ hàng rỗng:** Ngăn xác nhận thanh toán và ném `EmptyCartException` khi giỏ hàng chưa có bất kỳ món nào.
5. **R5 — Validate giá tiền & Số dư:** Bắt lỗi dữ liệu nếu món ăn có giá trị âm ($< 0$) hoặc số dư tài khoản khởi tạo âm.

---

## 📂 4. Cấu Trúc Cây Thư Mục Project

```text
KTXFoodOrder/
├── backend/
│   ├── data/                           # MOCK DATABASE JSON
│   │   ├── foods.json                  # Thực đơn món ăn KTX
│   │   ├── orders.json                 # Lịch sử đơn hàng
│   │   └── students.json               # Thông tin tài khoản sinh viên
│   └── src/
│       └── main/
│           └── java/
│               ├── handler/            # REST API Handlers (Food, Cart, Student, Order, Payment)
│               ├── main/
│               │   └── Main.java       # HTTP Web Server Bootstrap Entrypoint (Port 8080)
│               ├── model/              # OOP Models (User, Student, Food, Cart, CartItem, Order, OrderDetail)
│               ├── repository/         # JSON File Persistence Repositories
│               ├── service/            # Business Logic & Payment Polymorphism Services
│               └── utils/              # Custom Exceptions, Code Generator & Validation Utilities
└── frontend/                           # WEB UI FRONTEND (SPA Dashboard)
    ├── app.js                          # REST API Fetch & DOM Dynamic Controller
    ├── index.html                      # Modern Dashboard Markup
    └── style.css                       # Modern CSS3 Styling & Layout
