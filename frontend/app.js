let currentStudent = { id: "SV01", name: "Nguyễn Văn A", roomNumber: "A101", balance: 150000 };
let cart = [];

// Khởi chạy khi tải xong trang Web
document.addEventListener('DOMContentLoaded', () => {
    loadStudentInfo();
    loadMenuItems();
});

// 1. Tải thông tin sinh viên
function loadStudentInfo() {
    const profileEl = document.getElementById('user-profile');
    if (profileEl) {
        profileEl.innerHTML = `<strong>${currentStudent.name}</strong> | Phòng: ${currentStudent.roomNumber} | Ví: <strong>${currentStudent.balance.toLocaleString()} VNĐ</strong>`;
    }
}

// 2. Tải danh sách thực đơn món ăn
function loadMenuItems() {
    // Danh sách thực đơn mẫu phục vụ kiểm thử Web Server
    const defaultFoods = [
        { id: "F01", name: "Cơm tấm sườn nướng", price: 35000, category: "Cơm" },
        { id: "F02", name: "Bún bò Huế", price: 40000, category: "Bún/Phở" },
        { id: "F03", name: "Trà sữa Thái xanh", price: 20000, category: "Đồ uống" }
    ];
    renderFoodGrid(defaultFoods);
}

function renderFoodGrid(foods) {
    const container = document.getElementById('food-grid');
    if (!container) return;

    container.innerHTML = foods.map(food => `
        <div class="food-card">
            <div>
                <div class="food-title">${food.name}</div>
                <div class="food-price">${food.price.toLocaleString()} VNĐ</div>
                <small>Loại: ${food.category}</small>
            </div>
            <button class="btn-add" onclick="addToCart('${food.id}', '${food.name}', ${food.price})">
                + Thêm Món
            </button>
        </div>
    `).join('');
}

// 3. Thêm món vào giỏ hàng
function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    renderCart();
}

// 4. Hiển thị giỏ hàng
function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Giỏ hàng đang trống</p>';
        document.getElementById('cart-total').innerText = '0 VNĐ';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        return `
            <div class="cart-item">
                <span>${item.name} x${item.quantity}</span>
                <strong>${subtotal.toLocaleString()} VNĐ</strong>
            </div>
        `;
    }).join('');

    document.getElementById('cart-total').innerText = `${total.toLocaleString()} VNĐ`;
}

// 5. Đặt hàng & kiểm tra Business Rule 4 (Giỏ hàng rỗng)
async function checkout() {
    // Kiểm tra giỏ hàng rỗng (Business Rule 4)
    if (cart.length === 0) {
        alert('❌ Lỗi (Business Rule 4): Giỏ hàng rỗng, không thể tạo đơn hàng!');
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Kiểm tra số dư ví nếu chọn phương thức Ví Sinh Viên
    const paymentMethod = document.getElementById('payment-method').value;
    if (paymentMethod === 'WALLET' && currentStudent.balance < totalAmount) {
        alert('❌ Lỗi (CustomException): Số dư ví sinh viên không đủ để thanh toán!');
        return;
    }

    // Gửi thông báo thành công & làm sạch giỏ hàng
    alert(`🎉 Đặt hàng thành công!\nTổng tiền: ${totalAmount.toLocaleString()} VNĐ`);
    cart = [];
    renderCart();
}