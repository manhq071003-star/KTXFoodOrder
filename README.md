# 🍳 KTXFoodOrder — Hệ Thống Đặt Đồ Ăn Sinh Viên KTX

![Java](https://img.shields.io/badge/Java-17+-007396?style=for-the-badge&logo=java&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-3--Tier%20REST%20API-orange?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JS-yellow?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-Mock%20JSON%20via%20Gson-lightgrey?style=for-the-badge)

Dự án Bài tập lớn Lập trình hướng đối tượng (Java OOP) được xây dựng theo mô hình **Web Application REST API 3 tầng** chuẩn hóa. Hệ thống quản lý toàn bộ luồng đặt món, tính tiền, trừ ví sinh viên và lưu trữ lịch sử đơn hàng tự động bằng cơ chế mã hóa file JSON.

---

## 📌 1. Kiến Trúc Hệ Thống (3-Tier Architecture)

Dự án tuân thủ nguyên tắc **Separation of Concerns (SoC)** và **Dependency Direction (Phụ thuộc 1 chiều)**:
`Frontend Web (HTML/JS) ➔ REST Handlers ➔ Business Services ➔ Repositories ➔ Mock JSON Database`

* **Frontend (`frontend/`):** Giao diện người dùng tương tác dạng SPA (Single Page Application), xử lý `fetch()` API bất đồng bộ và render DOM linh hoạt.
* **Backend REST API (`backend/src/`):**
  * `handler`: Tiếp nhận HTTP Request, trích xuất tham số và phản hồi dữ liệu chuẩn `JSON`.
  * `service`: Chứa toàn bộ Logic nghiệp vụ, xử lý Đa hình (Polymorphism) trong thanh toán và kiểm soát Exception.
  * `repository`: Thực hiện thao tác CRUD đọc/ghi trực tiếp xuống Database file `.json` qua thư viện `Gson`.
  * `model`: Đóng gói dữ liệu đối tượng OOP (Encapsulation, Inheritance).
  * `utils`: Bộ công cụ sinh mã đơn hàng, Validate dữ liệu đầu vào và tập hợp Custom Exceptions.
* **Mock Database (`backend/data/`):** Lưu trữ dữ liệu hệ thống dưới dạng file JSON tĩnh.

---

## 🌐 2. Danh Sách REST API Endpoints

| HTTP Method | API Endpoint | Tầng Backend Xử Lý | Chức Năng Trên Giao Diện Web |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/students` | `StudentHandler` | Lấy thông tin sinh viên, phòng KTX và số dư ví hiển thị trên Header. |
| **GET** | `/api/foods` | `FoodHandler` | Lấy toàn bộ thực đơn món ăn render dạng Card UI. |
| **GET** | `/api/foods/search?name=` | `FoodHandler` | Tìm kiếm món ăn theo tên không phân biệt hoa/thường. |
| **POST** | `/api/orders` | `OrderHandler` | Gửi giỏ hàng, kiểm tra Business Rules & thực hiện thanh toán. |

---

## ⚙️ 3. Quy Tắc Nghiệp Vụ (5 Business Rules)

1. **R1 — Ngăn đặt món hết hàng:** Khóa chọn các món ăn đang có trạng thái `isAvailable = false`.
2. **R2 — Validate số lượng:** Bắt buộc số lượng món đặt mua phải $\ge 1$.
3. **R3 — Kiểm tra số dư ví:** Ném ngoại lệ `InsufficientBalanceException` nếu số dư ví không đủ chi trả tổng đơn.
4. **R4 — Chặn giỏ hàng rỗng:** Ngăn xác nhận thanh toán khi giỏ hàng chưa có bất kỳ món nào.
5. **R5 — Validate giá tiền:** Bắt lỗi dữ liệu nếu món ăn có giá trị âm ($< 0$).

---

## 📂 4. Cấu Trúc Cây Thư Mục Project

```text
KTXFoodOrder/
├── backend/                             # TẦNG BACKEND (JAVA REST API)
│   ├── data/                            # Mock Database JSON
│   │   ├── foods.json                   # Thực đơn món ăn KTX
│   │   ├── orders.json                  # Lịch sử đơn hàng
│   │   └── students.json                # Thông tin tài khoản sinh viên
│   └── src/
│       └── main/
│           └── java/
│               ├── handler/             # API Controllers (Food, Order, Student)
│               ├── main/                # Web Server Bootstrap (MainApplication.java)
│               ├── model/               # Object Models (User, Student, Food, Cart, Order...)
│               ├── repository/          # JSON File Persistence Manager
│               ├── service/             # Business Logic & Payment Polymorphism
│               └── utils/               # Exceptions, Code Generator & Validation
│
└── frontend/                            # TẦNG FRONTEND (WEB UI)
    ├── app.js                           # REST API Fetch & DOM Controller
    ├── index.html                       # Dashboard Giao diện đặt món
    └── style.css                        # Modern UI Styling
