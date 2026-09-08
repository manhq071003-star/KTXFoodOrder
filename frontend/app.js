const API_BASE = "/api";
let currentStudentId = "SV002";
let studentBalance = 180000;
let cart = [];
let foodsData = [];
let selectedVoucherId = null;
let discountAmount = 0;
let pendingOrderData = null;
let selectedFoodForTopping = null;

// Kho Voucher
let myVouchers = [
    { id: 'v1', name: 'Giảm 5.000 VNĐ (Tân sinh viên)', value: 5000 },
    { id: 'v2', name: 'Giảm 10.000 VNĐ (Tri ân KTX)', value: 10000 }
];

// Danh sách Shipper KTX
const shipperList = [
    { name: "Nguyễn Văn Hoàng", phone: "0987.654.321" },
    { name: "Trần Quốc Tuấn", phone: "0912.345.678" },
    { name: "Lê Minh Sơn", phone: "0936.888.999" },
    { name: "Phạm Đức Anh", phone: "0971.222.333" }
];

let isSpinning = false;

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadStudentInfo();
    loadFoods();
    initWheelCanvas();
    renderVoucherDropdown();

    // Đồng bộ Real-time giữa Bếp Admin & Trang Sinh Viên
    window.addEventListener("storage", (e) => {
        if (e.key === "ktx_foods_data" && e.newValue) {
            foodsData = JSON.parse(e.newValue);
            refreshAllViews();
        }
    });
});

// XỬ LÝ CHUYỂN ĐỔI GIAO DIỆN SÁNG / TỐI (DARK MODE)
function initTheme() {
    const savedTheme = localStorage.getItem("ktx_theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        updateThemeButton(true);
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("ktx_theme", isDark ? "dark" : "light");
    updateThemeButton(isDark);
}

function updateThemeButton(isDark) {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    if (isDark) {
        btn.innerHTML = `<i class="fa-solid fa-sun" style="color:#f1c40f;"></i> <span>Nền Sáng</span>`;
    } else {
        btn.innerHTML = `<i class="fa-solid fa-moon"></i> <span>Nền Tối</span>`;
    }
}

// 1. TẢI VÀ NẠP DỮ LIỆU ĐỦ 18 MÓN ĂN (GỒM 5 MÓN MỚI BỔ SUNG)
function loadFoods() {
    const localData = localStorage.getItem("ktx_foods_data");
    if (localData) {
        foodsData = JSON.parse(localData);

        // Tự động kiểm tra và bổ sung 5 món mới nếu LocalStorage cũ chưa có
        const hasNewFoods = foodsData.some(f => f.id === 'F14');
        if (!hasNewFoods) {
            foodsData.push(
                { id: 'F14', name: 'Trà chanh giã tay', price: 18000, imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500', available: true },
                { id: 'F15', name: 'Sữa chua trân châu Hạ Long', price: 22000, imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500', available: true },
                { id: 'F16', name: 'Cà phê muối béo', price: 20000, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500', available: true },
                { id: 'F17', name: 'Cơm gà mắm tỏi xối mỡ', price: 35000, imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500', available: true },
                { id: 'F18', name: 'Mì Ý sốt bò băm phô mai', price: 38000, imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500', available: true }
            );
            saveToStorage();
        }
        refreshAllViews();
        return;
    }

    // Danh sách 18 món đầy đủ
    foodsData = [
        { id: 'F01', name: 'Cơm tấm sườn nướng', price: 30000, imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500', available: true },
        { id: 'F02', name: 'Bún bò Huế đặc biệt', price: 35000, imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500', available: true },
        { id: 'F03', name: 'Mì xào hải sản', price: 35000, imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500', available: true },
        { id: 'F04', name: 'Trà sữa thái xanh', price: 15000, imageUrl: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=500', available: true },
        { id: 'F05', name: 'Bánh mì thịt nướng', price: 20000, imageUrl: 'https://images.unsplash.com/photo-1626844131082-256783844137?w=500', available: true },
        { id: 'F06', name: 'Bún đậu mắm tôm', price: 40000, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500', available: true },
        { id: 'F07', name: 'Phở bò tái lăn', price: 40000, imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500', available: true },
        { id: 'F08', name: 'Trà đào cam sả', price: 20000, imageUrl: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=500', available: true },
        { id: 'F09', name: 'Cơm chiên Dương Châu', price: 30000, imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500', available: true },
        { id: 'F10', name: 'Xôi xéo thập cẩm', price: 20000, imageUrl: 'https://images.unsplash.com/photo-1626844131082-256783844137?w=500', available: true },
        { id: 'F11', name: 'Xôi gà xé phay', price: 20000, imageUrl: 'https://images.unsplash.com/photo-1626844131082-256783844137?w=500', available: true },
        { id: 'F12', name: 'Bánh mì chả lụa pate', price: 20000, imageUrl: 'https://images.unsplash.com/photo-1626844131082-256783844137?w=500', available: true },
        { id: 'F13', name: 'Bánh mì 2 trứng ốp la', price: 20000, imageUrl: 'https://images.unsplash.com/photo-1626844131082-256783844137?w=500', available: true },
        { id: 'F14', name: 'Trà chanh giã tay', price: 18000, imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500', available: true },
        { id: 'F15', name: 'Sữa chua trân châu Hạ Long', price: 22000, imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500', available: true },
        { id: 'F16', name: 'Cà phê muối béo', price: 20000, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500', available: true },
        { id: 'F17', name: 'Cơm gà mắm tỏi xối mỡ', price: 35000, imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500', available: true },
        { id: 'F18', name: 'Mì Ý sốt bò băm phô mai', price: 38000, imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500', available: true }
    ];
    saveToStorage();
    refreshAllViews();
}

function saveToStorage() {
    localStorage.setItem("ktx_foods_data", JSON.stringify(foodsData));
}

function refreshAllViews() {
    renderFoodGrid(foodsData);
    renderAdminTable(foodsData);
}

// 2. CẤU HÌNH TOPPING ĐẶC THÙ CHO MÓN ĂN
function getToppingsForFood(food) {
    const name = food.name.toLowerCase();

    if (name.includes("trà chanh")) {
        return [
            { name: "Thêm Trân châu trắng giòn", price: 5000 },
            { name: "Thêm Thạch nha đam", price: 5000 },
            { name: "Thêm Chanh tươi / Sả giã", price: 3000 }
        ];
    }

    if (name.includes("sữa chua")) {
        return [
            { name: "Thêm Trân châu cốt dừa nóng", price: 6000 },
            { name: "Thêm Dừa khô / Chuối sấy", price: 4000 },
            { name: "Thêm Thạch lá nếp", price: 5000 }
        ];
    }

    if (name.includes("cà phê")) {
        return [
            { name: "Thêm Kem mặn / Kem muối extra", price: 6000 },
            { name: "Thêm Shot Espresso đậm vị", price: 8000 },
            { name: "Thêm Sữa đặc Bông Thọ", price: 3000 }
        ];
    }

    if (name.includes("cơm gà")) {
        return [
            { name: "Thêm Trứng ốp la lòng đào", price: 5000 },
            { name: "Thêm Đùi gà nướng extra", price: 20000 },
            { name: "Thêm Canh xúp rau củ", price: 4000 }
        ];
    }

    if (name.includes("mì ý")) {
        return [
            { name: "Thêm Phô mai Mozzarella đút lò", price: 10000 },
            { name: "Thêm Xúc xích xông khói", price: 8000 },
            { name: "Thêm Sốt bò băm extra", price: 10000 }
        ];
    }

    if (name.includes("bún bò") || name.includes("phở")) {
        return [
            { name: "Chả cua / Chả lá lốt", price: 7000 },
            { name: "Huyết / Mọc giòn", price: 5000 },
            { name: "Thịt bắp bò / Tái nạm", price: 12000 }
        ];
    }

    if (name.includes("cơm")) {
        return [
            { name: "Trứng ốp la", price: 5000 },
            { name: "Chả trứng / Bì heo", price: 7000 },
            { name: "Sườn nướng extra", price: 15000 }
        ];
    }

    if (name.includes("trà") || name.includes("sữa")) {
        return [
            { name: "Trân châu đen / Trắng", price: 5000 },
            { name: "Cream cheese / Macchiato", price: 8000 },
            { name: "Pudding trứng", price: 6000 }
        ];
    }

    return [
        { name: "Trứng ốp la", price: 5000 },
        { name: "Xúc xích", price: 7000 }
    ];
}

function addToCart(id) {
    const food = foodsData.find(f => f.id === id);
    if (!food || !food.available) return;

    selectedFoodForTopping = food;

    document.getElementById("topping-food-name").innerText = food.name;
    document.getElementById("topping-food-price").innerText = food.price.toLocaleString('vi-VN') + " VNĐ";

    const container = document.getElementById("topping-options-list");
    container.innerHTML = "";

    const toppingsToShow = getToppingsForFood(food);

    toppingsToShow.forEach(top => {
        container.innerHTML += `
            <label style="display: flex; justify-content: space-between; align-items: center; background: var(--user-bg); padding: 10px 12px; border-radius: 6px; cursor: pointer; border: 1px solid var(--border-color);">
                <span>
                    <input type="checkbox" class="topping-checkbox" data-name="${top.name}" data-price="${top.price}" style="margin-right: 8px;">
                    ${top.name}
                </span>
                <b style="color: #ff5722; font-size: 13px;">+${top.price.toLocaleString('vi-VN')} VNĐ</b>
            </label>
        `;
    });

    document.getElementById("topping-modal").style.display = "flex";
}

function confirmAddToCartWithToppings() {
    if (!selectedFoodForTopping) return;

    const selectedToppings = [];
    let extraPrice = 0;

    document.querySelectorAll(".topping-checkbox:checked").forEach(cb => {
        const topName = cb.getAttribute("data-name");
        const topPrice = parseFloat(cb.getAttribute("data-price"));
        selectedToppings.push(topName);
        extraPrice += topPrice;
    });

    const unitPrice = selectedFoodForTopping.price + extraPrice;
    const toppingText = selectedToppings.length > 0 ? ` (+${selectedToppings.join(', ')})` : '';
    const cartItemId = selectedFoodForTopping.id + "_" + selectedToppings.sort().join('_');

    const existingItem = cart.find(i => i.cartItemId === cartItemId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            cartItemId: cartItemId,
            id: selectedFoodForTopping.id,
            name: selectedFoodForTopping.name + toppingText,
            price: unitPrice,
            quantity: 1
        });
    }

    closeModal("topping-modal");
    updateCartUI();
}

// 3. ĐẶT HÀNG & TÍNH TOÁN
function checkout() {
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }

    const methodSelect = document.getElementById("payment-method");
    const method = methodSelect ? methodSelect.value : "wallet";
    const orderNote = document.getElementById("order-note") ? document.getElementById("order-note").value.trim() : "";
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
    } else if (method === "cash") {
        paymentText = "Tiền mặt khi nhận hàng (COD)";
    } else if (method === "bank") {
        paymentText = "Chuyển khoản QR Ngân hàng";
    }

    const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const timeString = now.toLocaleTimeString('vi-VN') + " - " + now.toLocaleDateString('vi-VN');
    const assignedShipper = shipperList[Math.floor(Math.random() * shipperList.length)];
    const otpCode = Math.floor(1000 + Math.random() * 9000);

    pendingOrderData = {
        orderId,
        timeString,
        assignedShipper,
        otpCode,
        subtotal,
        finalTotal,
        paymentText,
        orderNote: orderNote || "Không có ghi chú",
        cartItems: [...cart]
    };

    if (method === "bank") {
        const bankId = "MB";
        const accountNo = "0987654321";
        const accountName = "BEP KTX FOOD EXPRESS";
        const memo = `${orderId} ${currentStudentId}`;

        const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${finalTotal}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(accountName)}`;

        document.getElementById("pay-qr-code-img").src = qrUrl;
        document.getElementById("pay-qr-amount").innerText = finalTotal.toLocaleString('vi-VN') + " VNĐ";
        document.getElementById("pay-qr-memo").innerText = memo;

        document.getElementById("payment-qr-modal").style.display = "flex";
        return;
    }

    completeOrderProcess();
}

function confirmQrPayment() {
    closeModal('payment-qr-modal');
    completeOrderProcess();
}

function completeOrderProcess() {
    if (!pendingOrderData) return;

    const data = pendingOrderData;

    document.getElementById("inv-order-id").innerText = data.orderId;
    document.getElementById("inv-time").innerText = data.timeString;
    document.getElementById("inv-student-name").innerText = document.getElementById("student-name").innerText;
    document.getElementById("inv-student-id").innerText = currentStudentId;
    document.getElementById("inv-room").innerText = currentStudentId === "SV001" ? "P301" : "P205";
    document.getElementById("inv-payment-method").innerText = data.paymentText;
    document.getElementById("inv-order-note").innerText = data.orderNote;

    const itemsContainer = document.getElementById("inv-items-list");
    itemsContainer.innerHTML = "";
    data.cartItems.forEach(item => {
        itemsContainer.innerHTML += `
            <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:5px;">
                <span>${item.name} x${item.quantity}</span>
                <span>${(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
            </div>
        `;
    });

    document.getElementById("inv-subtotal").innerText = data.subtotal.toLocaleString('vi-VN') + " VNĐ";
    document.getElementById("inv-discount").innerText = "-" + discountAmount.toLocaleString('vi-VN') + " VNĐ";
    document.getElementById("inv-total").innerText = data.finalTotal.toLocaleString('vi-VN') + " VNĐ";

    document.getElementById("inv-shipper-name").innerText = data.assignedShipper.name;
    document.getElementById("inv-shipper-phone").innerText = data.assignedShipper.phone;
    document.getElementById("inv-shipper-phone").href = "tel:" + data.assignedShipper.phone;
    document.getElementById("inv-otp-code").innerText = data.otpCode;

    if (selectedVoucherId) {
        myVouchers = myVouchers.filter(v => v.id !== selectedVoucherId);
        selectedVoucherId = null;
        discountAmount = 0;
        renderVoucherDropdown();
    }

    cart = [];
    if (document.getElementById("order-note")) document.getElementById("order-note").value = "";
    updateCartUI();
    document.getElementById("invoice-modal").style.display = "flex";

    const box = document.getElementById("order-progress-box");
    const bike = document.getElementById("shipper-bike");
    const status = document.getElementById("order-status-text");
    if (box) {
        box.style.display = "block";
        bike.style.left = "10px";
        status.innerHTML = `Mã OTP: <span style="color:#20bf6b;">${data.otpCode}</span> | Shipper <b>${data.assignedShipper.name}</b> (${data.assignedShipper.phone}) đang nhận đơn...`;

        setTimeout(() => { bike.style.left = "45%"; status.innerHTML = `🛵 Shipper <b>${data.assignedShipper.name}</b> đang giao đồ ăn tới KTX...`; }, 3000);
        setTimeout(() => { bike.style.left = "80%"; status.innerHTML = `✅ Shipper đã tới nơi! Gọi <b>${data.assignedShipper.phone}</b> để nhận món.`; }, 7000);
    }

    pendingOrderData = null;
}

// 4. HIỂN THỊ DỮ LIỆU BẾP ADMIN VÀ THỰC ĐƠN
function renderFoodGrid(foods) {
    const grid = document.getElementById("food-grid");
    if (!grid) return;
    grid.innerHTML = "";
    foods.forEach((f, idx) => {
        const isHot = idx < 3;
        grid.innerHTML += `
            <div class="food-card ${!f.available ? 'disabled' : ''}">
                ${isHot ? '<span style="position:absolute; top:8px; left:8px; background:#e74c3c; color:#fff; font-size:11px; font-weight:bold; padding:3px 8px; border-radius:12px; z-index:2;">🔥 HOT</span>' : ''}
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
        <tr style="background:var(--user-bg); text-align:left; border-bottom:2px solid var(--border-color);">
            <th style="padding:10px;">Mã Món</th>
            <th>Tên Món Ăn</th>
            <th>Đơn Giá</th>
            <th>Trạng Thái</th>
            <th>Hành Động Quản Lý</th>
        </tr>
    `;
    foods.forEach(f => {
        table.innerHTML += `
            <tr style="border-bottom:1px solid var(--border-color);">
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
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:13px; border-bottom: 1px dashed var(--border-color); padding-bottom: 5px;">
                <div><b>${item.name}</b><br><small style="color:var(--text-muted);">${item.price.toLocaleString('vi-VN')} VNĐ x ${item.quantity}</small></div>
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
        renderFoodGrid(foodsData.filter(f => f.name.includes('Trà') || f.name.includes('Sữa') || f.name.includes('Cà phê')));
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

function initWheelCanvas() { drawWheel(0); }

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

function openTopUpModal() {
    document.getElementById("topup-modal").style.display = "flex";
    updateQrCode();
}

function updateQrCode() {
    const amountSelect = document.getElementById("topup-amount");
    if (!amountSelect) return;

    const amount = amountSelect.value;
    const memo = `NAP KTX ${currentStudentId}`;

    const memoElem = document.getElementById("topup-memo");
    if (memoElem) memoElem.innerText = memo;

    const bankId = "MB";
    const accountNo = "0987654321";
    const accountName = "BEP KTX FOOD EXPRESS";

    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(accountName)}`;

    const qrImg = document.getElementById("qr-code-img");
    if (qrImg) qrImg.src = qrUrl;
}

function confirmTopUp() {
    const amountSelect = document.getElementById("topup-amount");
    if (!amountSelect) return;

    const amount = parseFloat(amountSelect.value);
    studentBalance += amount;

    const balanceElem = document.getElementById("student-balance");
    if (balanceElem) balanceElem.innerText = studentBalance.toLocaleString('vi-VN') + " VNĐ";

    alert(`🎉 XÁC NHẬN THÀNH CÔNG!\nĐã nạp +${amount.toLocaleString('vi-VN')} VNĐ qua mã QR VietQR vào Ví Sinh Viên KTX.`);
    closeModal('topup-modal');
}

function toggleFoodStatus(id) {
    const food = foodsData.find(f => f.id === id);
    if (food) {
        food.available = !food.available;
        saveToStorage();
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
            cart.forEach(c => { if (c.id === id) c.price = food.price; });
            saveToStorage();
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
        saveToStorage();
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

    saveToStorage();
    refreshAllViews();
    alert(`Đã thêm món "${name}" vào thực đơn thành công!`);

    idInput.value = "";
    nameInput.value = "";
    priceInput.value = "";
    imgInput.value = "";
}

function openWheelModal() { document.getElementById("wheel-modal").style.display = "flex"; }
function openLoginModal() { document.getElementById("login-modal").style.display = "flex"; }
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

function filterFoods() {
    const q = document.getElementById("search-input").value.toLowerCase();
    renderFoodGrid(foodsData.filter(f => f.name.toLowerCase().includes(q)));
}