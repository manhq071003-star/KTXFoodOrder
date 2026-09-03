const API_BASE = "http://localhost:8080/api";
let currentStudentId = "SV002";
let studentBalance = 180000;
let cart = [];
let foodsData = [];

document.addEventListener("DOMContentLoaded", () => {
    loadStudentInfo();
    loadFoods();
});

function loadStudentInfo() {
    fetch(`${API_BASE}/students/${currentStudentId}`)
        .then(res => res.json())
        .then(student => {
            if (student && student.name) {
                document.getElementById("student-name").innerText = student.name;
                studentBalance = student.balance;
                document.getElementById("student-balance").innerText = student.balance.toLocaleString('vi-VN') + " VNĐ";
            }
        })
        .catch(() => {
            const balanceElem = document.getElementById("student-balance");
            if (balanceElem) balanceElem.innerText = studentBalance.toLocaleString('vi-VN') + " VNĐ";
        });
}

function loadFoods() {
    fetch(`${API_BASE}/foods`)
        .then(res => res.json())
        .then(foods => {
            foodsData = foods;
            renderFoodGrid(foods);
            renderAdminTable(foods);
        })
        .catch(err => console.error("Lỗi nạp thực đơn:", err));
}

function renderFoodGrid(foods) {
    const grid = document.getElementById("food-grid");
    if (!grid) return;
    grid.innerHTML = "";
    foods.forEach(f => {
        grid.innerHTML += `
            <div class="food-card">
                <img src="${f.imageUrl}" alt="${f.name}">
                <div class="food-info">
                    <div class="food-title">${f.name}</div>
                    <div class="food-price">${f.price.toLocaleString('vi-VN')} VNĐ</div>
                    <button class="btn-add" onclick="addToCart('${f.id}', '${f.name}', ${f.price})">➕ Thêm món</button>
                </div>
            </div>
        `;
    });
}

function renderAdminTable(foods) {
    const table = document.getElementById("admin-food-table");
    if (!table) return;
    table.innerHTML = `
        <tr style="background:#f8f9fa; text-align:left; border-bottom:2px solid #ddd;">
            <th style="padding:10px;">Mã Món</th>
            <th>Tên Món Ăn</th>
            <th>Đơn Giá</th>
            <th>Trạng Thái</th>
            <th>Hành Động Quản Lý</th>
        </tr>
    `;
    foods.forEach(f => {
        table.innerHTML += `
            <tr style="border-bottom:1px solid #eee;">
                <td style="padding:12px 10px;"><b>${f.id}</b></td>
                <td><b>${f.name}</b></td>
                <td>${f.price.toLocaleString('vi-VN')} VNĐ</td>
                <td><span style="color:#20bf6b;">✓ Đang mở bán</span></td>
                <td>
                    <button style="background:#e74c3c; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Báo hết hàng</button>
                    <button style="background:#3498db; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Sửa giá</button>
                    <button style="background:#ff5252; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Xóa</button>
                </td>
            </tr>
        `;
    });
}

function addToCart(id, name, price) {
    const item = cart.find(i => i.id === id);
    if (item) item.quantity++;
    else cart.push({ id, name, price, quantity: 1 });
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById("cart-items");
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Chưa có món nào trong giỏ hàng</p>';
        document.getElementById("subtotal").innerText = "0 VNĐ";
        document.getElementById("total-price").innerText = "0 VNĐ";
        return;
    }
    let subtotal = 0;
    container.innerHTML = "";
    cart.forEach(item => {
        const total = item.price * item.quantity;
        subtotal += total;
        container.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:14px;">
                <div><b>${item.name}</b><br><small>${item.price.toLocaleString('vi-VN')} VNĐ x ${item.quantity}</small></div>
                <div><b>${total.toLocaleString('vi-VN')} VNĐ</b></div>
            </div>
        `;
    });
    document.getElementById("subtotal").innerText = subtotal.toLocaleString('vi-VN') + " VNĐ";
    document.getElementById("total-price").innerText = subtotal.toLocaleString('vi-VN') + " VNĐ";
}

function checkout() {
    if (cart.length === 0) { alert("Giỏ hàng trống!"); return; }
    alert("🎉 Đặt hàng thành công! Đơn đã chuyển sang Bếp KTX.");
    cart = [];
    updateCartUI();
}

function topUp() {
    studentBalance += 50000;
    document.getElementById("student-balance").innerText = studentBalance.toLocaleString('vi-VN') + " VNĐ";
    alert("Nạp thành công +50.000 VNĐ vào Ví Sinh Viên!");
}

function openWheel() {
    alert("🎡 Vòng quay may mắn đang khởi chạy!");
}

function filterFoods() {
    const q = document.getElementById("search-input").value.toLowerCase();
    renderFoodGrid(foodsData.filter(f => f.name.toLowerCase().includes(q)));
}