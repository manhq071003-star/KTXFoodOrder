const API_BASE = "/api";
let currentStudentId = "SV002";
let studentBalance = 180000;
let cart = [];
let foodsData = [];
let selectedVoucherId = null;
let discountAmount = 0;

// Kho Voucher
let myVouchers = [
    { id: 'v1', name: 'Giảm 5.000 VNĐ (Tân sinh viên)', value: 5000 },
    { id: 'v2', name: 'Giảm 10.000 VNĐ (Tri ân KTX)', value: 10000 }
];

// Shipper KTX
const shipperList = [
    { name: "Nguyễn Văn Hoàng", phone: "0987.654.321" },
    { name: "Trần Quốc Tuấn", phone: "0912.345.678" },
    { name: "Lê Minh Sơn", phone: "0936.888.999" },
    { name: "Phạm Đức Anh", phone: "0971.222.333" }
];

let isSpinning = false;

document.addEventListener("DOMContentLoaded", () => {
    loadStudentInfo();
    loadFoods();
    initWheelCanvas();
    renderVoucherDropdown();
});

// 1. TẢI DỮ LIỆU MÓN ÁN & ĐỒNG BỘ TRANG BẾP ADMIN
function loadFoods() {
    fetch(`${API_BASE}/foods`)
        .then(res => res.json())
        .then(foods => {
            foodsData = foods;
            refreshAllViews();
        })
        .catch(() => {
            if (foodsData.length === 0) {
                foodsData = [
                    { id: 'F01', name: 'Cơm tấm sườn nướng', price: 30000, imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500', available: true },
                    { id: 'F02', name: 'Bún bò Huế đặc biệt', price: 35000, imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500', available: true },
                    { id: 'F03', name: 'Mì xào hải sản', price: 35000, imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500', available: true },
                    { id: 'F04', name: 'Trà sữa thái xanh', price: 15000, imageUrl: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=500', available: true },
                    { id: 'F05', name: 'Bánh mì thịt nướng', price: 20000, imageUrl: 'https://images.unsplash.com/photo-1626844131082-256783844137?w=500', available: true }
                ];
            }
            refreshAllViews();
        });
}

function refreshAllViews() {
    renderFoodGrid(foodsData);
    renderAdminTable(foodsData);
}

// CHỨC NĂNG BẾP ADMIN
function toggleFoodStatus(id) {
    const food = foodsData.find(f => f.id === id);
    if (food) {
        food.available = !food.available;
        refreshAllViews();
        alert(`Đã cập nhật trạng thái món ${food.name}: ${food.available ? 'Mở bán' : 'Hết hàng'}!`);
    }
}

function editFoodPrice(id) {
    const food = foodsData.find(f => f.id === id);
    if (food) {
        const newPrice = prompt(`Nhập đơn giá mới cho "${food.name}" (VNĐ):`, food.price);
        if (newPrice !== null && !isNaN(newPrice) && parseFloat(newPrice) >= 0) {
            food.price = parseFloat(newPrice);
            const cartItem = cart.find(c => c.id === id);
            if (cartItem) cartItem.price = food.price;

            refreshAllViews();
            updateCartUI();
            alert(`Đã cập nhật giá món "${food.name}" thành ${food.price.toLocaleString('vi-VN')} VNĐ!`);
        }
    }
}

function deleteFood(id) {
    const food = foodsData.find(f => f.id === id);
    if (food && confirm(`Bạn có chắc chắn muốn xóa món "${food.name}" khỏi thực đơn?`)) {
        foodsData = foodsData.filter(f => f.id !== id);
        cart = cart.filter(c => c.id !== id);
        refreshAllViews();
        updateCartUI();
        alert("Đã xóa món ăn khỏi thực đơn!");
    }
}

function addNewFood() {
    const idInput = document.getElementById("new-food-id");
    const nameInput = document.getElementById("new-food-name");
    const priceInput = document.getElementById("new-food-price");
    const imgInput = document.getElementById("new-food-img");

    if (!idInput || !nameInput || !priceInput) return;

    const id = idInput.value.trim();
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const img = imgInput.value.trim();

    if (!id || !name || isNaN(price)) {
        alert("Vui lòng nhập đầy đủ Mã món, Tên món và Giá tiền!");
        return;
    }

    if (foodsData.some(f => f.id === id)) {
        alert("Mã món này đã tồn tại! Vui lòng chọn mã khác.");
        return;
    }

    foodsData.push({
        id: id,
        name: name,
        price: price,
        imageUrl: img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
        available: true
    });

    refreshAllViews();
    alert(`Đã thêm món "${name}" vào thực đơn thành công!`);

    idInput.value = "";
    nameInput.value = "";
    priceInput.value = "";
    imgInput.value = "";
}

// 2. KHO VOUCHER & TỰ ĐỘNG XÓA KHI SỬ DỤNG
function renderVoucherDropdown() {
    const select = document.getElementById("voucher-select");
    if (!select) return;

    select.innerHTML = '<option value="">Không dùng Voucher</option>';
    myVouchers.forEach(v => {
        select.innerHTML += `<option value="${v.id}">${v.name}</option>`;
    });

    if (selectedVoucherId && !myVouchers.some(v => v.id === selectedVoucherId)) {
        selectedVoucherId = null;
        discountAmount = 0;
        select.value = "";
    }
}

function applyVoucherSelect() {
    const select = document.getElementById("voucher-select");
    selectedVoucherId = select.value || null;

    if (selectedVoucherId) {
        const v = myVouchers.find(item => item.id === selectedVoucherId);
        discountAmount = v ? v.value : 0;
    } else {
        discountAmount = 0;
    }
    updateCartUI();
}

// 3. VÒNG QUAY MAY MẮN CANVAS 360°
function initWheelCanvas() {
    drawWheel(0);
}

function drawWheel(angleDeg) {
    const canvas = document.getElementById("wheel-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const colors = ["#ff7675", "#74b9ff", "#55efc4", "#ffeaa7", "#a29bfe", "#fd79a8"];
    const labels = ["Giảm 10k", "Mất lượt", "Giảm 5k", "Freeship", "May mắn", "Giảm 20k"];

    ctx.clearRect(0, 0, 280, 280);
    ctx.save();
    ctx.translate(140, 140);
    ctx.rotate((angleDeg * Math.PI) / 180);

    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 130, (i * 60 * Math.PI) / 180, ((i + 1) * 60 * Math.PI) / 180);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.rotate(((i * 60 + 30) * Math.PI) / 180);
        ctx.fillStyle = "#333";
        ctx.font = "bold 12px Segoe UI";
        ctx.fillText(labels[i], 45, 5);
        ctx.restore();
    }
    ctx.restore();
}

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    const spinBtn = document.getElementById("spin-btn");
    if (spinBtn) spinBtn.disabled = true;

    const randomDegree = 1800 + Math.floor(Math.random() * 360);
    const duration = 4000;
    const start = performance.now();

    function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentAngle = easeOut * randomDegree;

        drawWheel(currentAngle);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            if (spinBtn) spinBtn.disabled = false;

            const newVoucher = {
                id: 'v_' + Date.now(),
                name: 'Giảm 10.000 VNĐ (Từ Vòng Quay)',
                value: 10000
            };
            myVouchers.push(newVoucher);
            renderVoucherDropdown();

            alert("🎉 Chúc mừng! Bạn nhận được Voucher GIẢM 10.000 VNĐ và đã được lưu vào Kho Voucher!");
            closeModal('wheel-modal');
        }
    }
    requestAnimationFrame(animate);
}

// 4. ĐẶT HÀNG & XUẤT HÓA ĐƠN CHI TIẾT
function checkout() {
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }

    const methodSelect = document.getElementById("payment-method");
    const method = methodSelect ? methodSelect.value : "wallet";
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = Math.max(0, subtotal - discountAmount);

    let paymentText = "";
    if (method === "wallet") {
        if (studentBalance < finalTotal) {
            alert("Số dư ví KTX không đủ! Vui lòng nạp tiền hoặc chọn hình thức COD/Chuyển khoản.");
            return;
        }
        studentBalance -= finalTotal;
        document.getElementById("student-balance").innerText = studentBalance.toLocaleString('vi-VN') + " VNĐ";
        paymentText = "Ví Sinh Viên KTX (Đã trừ)";
    } else if (method === "bank") {
        paymentText = "Chuyển khoản QR Ngân hàng";
    } else if (method === "cash") {
        paymentText = "Tiền mặt khi nhận hàng (COD)";
    }

    // Thông tin hóa đơn
    const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const timeString = now.toLocaleTimeString('vi-VN') + " - " + now.toLocaleDateString('vi-VN');
    const assignedShipper = shipperList[Math.floor(Math.random() * shipperList.length)];
    const otpCode = Math.floor(1000 + Math.random() * 9000);

    // Điền thông tin Modal Hóa Đơn
    document.getElementById("inv-order-id").innerText = orderId;
    document.getElementById("inv-time").innerText = timeString;
    document.getElementById("inv-student-name").innerText = document.getElementById("student-name").innerText;
    document.getElementById("inv-student-id").innerText = currentStudentId;
    document.getElementById("inv-room").innerText = currentStudentId === "SV001" ? "P301" : "P205";
    document.getElementById("inv-payment-method").innerText = paymentText;

    const itemsContainer = document.getElementById("inv-items-list");
    itemsContainer.innerHTML = "";
    cart.forEach(item => {
        itemsContainer.innerHTML += `
            <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:5px;">
                <span>${item.name} x${item.quantity}</span>
                <span>${(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
            </div>
        `;
    });

    document.getElementById("inv-subtotal").innerText = subtotal.toLocaleString('vi-VN') + " VNĐ";
    document.getElementById("inv-discount").innerText = "-" + discountAmount.toLocaleString('vi-VN') + " VNĐ";
    document.getElementById("inv-total").innerText = finalTotal.toLocaleString('vi-VN') + " VNĐ";

    document.getElementById("inv-shipper-name").innerText = assignedShipper.name;
    document.getElementById("inv-shipper-phone").innerText = assignedShipper.phone;
    document.getElementById("inv-shipper-phone").href = "tel:" + assignedShipper.phone;
    document.getElementById("inv-otp-code").innerText = otpCode;

    // Xóa Voucher vừa dùng
    if (selectedVoucherId) {
        myVouchers = myVouchers.filter(v => v.id !== selectedVoucherId);
        selectedVoucherId = null;
        discountAmount = 0;
        renderVoucherDropdown();
    }

    cart = [];
    updateCartUI();
    document.getElementById("invoice-modal").style.display = "flex";

    // Khởi chạy Shipper Tracker
    const box = document.getElementById("order-progress-box");
    const bike = document.getElementById("shipper-bike");
    const status = document.getElementById("order-status-text");
    if (box) {
        box.style.display = "block";
        bike.style.left = "10px";
        status.innerHTML = `Mã OTP: <span style="color:#20bf6b;">${otpCode}</span> | Shipper <b>${assignedShipper.name}</b> (${assignedShipper.phone}) đang nhận đơn...`;

        setTimeout(() => { bike.style.left = "45%"; status.innerHTML = `🛵 Shipper <b>${assignedShipper.name}</b> đang giao đồ ăn tới KTX...`; }, 3000);
        setTimeout(() => { bike.style.left = "80%"; status.innerHTML = `✅ Shipper đã tới nơi! Gọi <b>${assignedShipper.phone}</b> để nhận món.`; }, 7000);
    }
}

// 5. CÁC HÀM PHỤ TRỢ GIAO DIỆN
function renderFoodGrid(foods) {
    const grid = document.getElementById("food-grid");
    if (!grid) return;
    grid.innerHTML = "";
    foods.forEach(f => {
        grid.innerHTML += `
            <div class="food-card ${!f.available ? 'disabled' : ''}">
                <img src="${f.imageUrl}" alt="${f.name}">
                <div class="food-info">
                    <div class="food-title">${f.name}</div>
                    <div class="food-price">${f.price.toLocaleString('vi-VN')} VNĐ</div>
                    <button class="btn-add" onclick="addToCart('${f.id}')" ${!f.available ? 'disabled' : ''}>
                        ${f.available ? '➕ Thêm món' : '🚫 Hết hàng'}
                    </button>
                </div>
            </div>
        `;
    });
}

function renderAdminTable(foods) {
    const table = document.getElementById("admin-food-table");
    if (!table) return;

    let activeCount = foods.filter(f => f.available).length;
    const activeElem = document.getElementById("active-foods");
    if (activeElem) activeElem.innerText = `${activeCount} / ${foods.length} Món`;

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
                <td>
                    ${f.available
            ? '<span style="color:#20bf6b; font-weight:bold;">✓ Đang mở bán</span>'
            : '<span style="color:#eb4d4b; font-weight:bold;">✕ Hết hàng</span>'}
                </td>
                <td>
                    <button onclick="toggleFoodStatus('${f.id}')" style="background:${f.available ? '#e74c3c' : '#20bf6b'}; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; margin-right:5px;">
                        ${f.available ? 'Báo hết hàng' : 'Mở bán lại'}
                    </button>
                    <button onclick="editFoodPrice('${f.id}')" style="background:#3498db; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; margin-right:5px;">Sửa giá</button>
                    <button onclick="deleteFood('${f.id}')" style="background:#ff5252; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Xóa</button>
                </td>
            </tr>
        `;
    });
}

function addToCart(id) {
    const food = foodsData.find(f => f.id === id);
    if (!food || !food.available) return;

    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ id: food.id, name: food.name, price: food.price, quantity: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById("cart-items");
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Chưa có món nào trong giỏ hàng</p>';
        document.getElementById("subtotal").innerText = "0 VNĐ";
        document.getElementById("discount").innerText = "0 VNĐ";
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

    const finalTotal = Math.max(0, subtotal - discountAmount);
    document.getElementById("subtotal").innerText = subtotal.toLocaleString('vi-VN') + " VNĐ";
    document.getElementById("discount").innerText = discountAmount.toLocaleString('vi-VN') + " VNĐ";
    document.getElementById("total-price").innerText = finalTotal.toLocaleString('vi-VN') + " VNĐ";
}

function filterCategory(cat, btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    if (cat === 'all') {
        renderFoodGrid(foodsData);
    } else if (cat === 'com') {
        renderFoodGrid(foodsData.filter(f => f.name.includes('Cơm') || f.name.includes('Bún') || f.name.includes('Phở') || f.name.includes('Mì')));
    } else if (cat === 'banhmi') {
        renderFoodGrid(foodsData.filter(f => f.name.includes('Bánh mì') || f.name.includes('Xôi')));
    } else if (cat === 'doung') {
        renderFoodGrid(foodsData.filter(f => f.name.includes('Trà') || f.name.includes('Sữa')));
    }
}

function loadStudentInfo() {
    fetch(`${API_BASE}/students/${currentStudentId}`)
        .then(res => res.json())
        .then(s => {
            if (s && s.name) {
                document.getElementById("student-name").innerText = s.name;
                studentBalance = s.balance;
                document.getElementById("student-balance").innerText = s.balance.toLocaleString('vi-VN') + " VNĐ";
            }
        }).catch(() => {});
}

function openWheelModal() { document.getElementById("wheel-modal").style.display = "flex"; }
function openLoginModal() { document.getElementById("login-modal").style.display = "flex"; }
// 1. Hàm MỞ Modal khi bấm nút "Nạp tiền" ở Header
function openTopUpModal() {
    document.getElementById("topup-modal").style.display = "flex";
}

// 2. Hàm XÁC NHẬN NẠP TIỀN khi bấm nút trong Modal VietQR
function confirmTopUp() {
    const amount = 50000; // Mặc định cộng 50.000 VNĐ (hoặc thay đổi tùy bạn)
    studentBalance += amount;

    // Cập nhật lại số dư hiển thị trên thanh Header
    const balanceEl = document.getElementById("student-balance");
    if (balanceEl) {
        balanceEl.innerText = studentBalance.toLocaleString('vi-VN') + " VNĐ";
    }

    alert(`Yêu cầu nạp tiền đã được gửi! Đã cộng +${amount.toLocaleString('vi-VN')} VNĐ vào Ví KTX.`);
    closeModal('topup-modal'); // Đóng Modal
}
function closeModal(id) { document.getElementById(id).style.display = "none"; }

function loginStudent() {
    const mssv = document.getElementById("login-mssv").value.trim().toUpperCase();
    if (mssv) {
        currentStudentId = mssv;
        alert(`Đã đăng nhập tài khoản ${mssv}!`);
        closeModal('login-modal');
        loadStudentInfo();
    }
}

function confirmTopUp() {
    const amount = parseFloat(document.getElementById("topup-amount").value);
    studentBalance += amount;
    document.getElementById("student-balance").innerText = studentBalance.toLocaleString('vi-VN') + " VNĐ";
    alert(`Nạp thành công +${amount.toLocaleString('vi-VN')} VNĐ!`);
    closeModal('topup-modal');
}

function filterFoods() {
    const q = document.getElementById("search-input").value.toLowerCase();
    renderFoodGrid(foodsData.filter(f => f.name.toLowerCase().includes(q)));
}