const API_BASE = "http://localhost:8080/api";
let CURRENT_STUDENT_ID = null;
let discountAmount = 0;
let appliedVoucherCode = "";
let currentStudentBalance = 0;
let allFoods = [];
let favoriteFoods = new Set();
let currentCategory = 'ALL';
let orderHistory = [];
let walletLogs = [];
let selectedFoodForDetail = null;
let selectedToppings = [];
let currentRating = 5;
let currentReviewOrderId = null;
let customCartItems = [];
let studentVouchers = [];

const prizes = [
    { name: "Giảm 5k", discount: 5000, color: "#f87171" },
    { name: "Chúc may mắn", discount: 0, color: "#cbd5e1" },
    { name: "Giảm 10k", discount: 10000, color: "#60a5fa" },
    { name: "Freeship 10k", discount: 10000, color: "#34d399" },
    { name: "Giảm 5k", discount: 5000, color: "#fbbf24" },
    { name: "Chúc may mắn", discount: 0, color: "#cbd5e1" },
    { name: "Giảm 10k", discount: 10000, color: "#a78bfa" },
    { name: "Freeship 10k", discount: 10000, color: "#f472b6" }
];

let currentWheelRotation = 0;

document.addEventListener("DOMContentLoaded", () => {
    const savedStudent = localStorage.getItem("CURRENT_STUDENT_ID");
    if (savedStudent) {
        CURRENT_STUDENT_ID = savedStudent;
        loadStudent();
        document.getElementById("auth-buttons").style.display = "none";
        document.getElementById("user-info").style.display = "flex";
    }
    loadStudentVouchers();
    loadFoods();
    setTimeout(drawWheel, 300);
});

/* ==================== QUẢN LÝ KHO VOUCHER ==================== */
function loadStudentVouchers() {
    const key = "STUDENT_VOUCHERS_" + (CURRENT_STUDENT_ID || "GUEST");
    const saved = localStorage.getItem(key);
    if (saved) {
        studentVouchers = JSON.parse(saved);
    } else {
        studentVouchers = [
            { code: "KTXFREESHIP", name: "Voucher Freeship 10k", discount: 10000, isUsed: false }
        ];
        localStorage.setItem(key, JSON.stringify(studentVouchers));
    }
    updateVoucherCountBadge();
}

function saveStudentVouchers() {
    const key = "STUDENT_VOUCHERS_" + (CURRENT_STUDENT_ID || "GUEST");
    localStorage.setItem(key, JSON.stringify(studentVouchers));
    updateVoucherCountBadge();
}

function updateVoucherCountBadge() {
    const unusedCount = studentVouchers.filter(v => !v.isUsed).length;
    const badge = document.getElementById("voucher-count");
    if (badge) badge.innerText = unusedCount;
}

function openVoucherWalletModal() {
    const list = document.getElementById("voucher-wallet-list");
    if (!list) return;
    list.innerHTML = "";

    const availableVouchers = studentVouchers.filter(v => !v.isUsed);

    if (availableVouchers.length === 0) {
        list.innerHTML = `<p class="empty-text">Kho voucher đang trống. Hãy quay vòng quay để nhận thêm nhé!</p>`;
    } else {
        availableVouchers.forEach((v) => {
            const isSelected = appliedVoucherCode === v.code;
            list.innerHTML += `
                <div style="border: 1px dashed #8b5cf6; padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; background: ${isSelected ? '#f3e8ff' : '#fff'};">
                    <div>
                        <div style="font-weight: bold; color: #8b5cf6; font-size: 13px;">${v.name}</div>
                        <div style="font-size: 11px; color: #666;">Mã: <strong>${v.code}</strong> (-${v.discount.toLocaleString()} VNĐ)</div>
                    </div>
                    <button style="background: ${isSelected ? '#ef4444' : '#8b5cf6'}; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold;" 
                            onclick="${isSelected ? 'removeAppliedVoucher()' : `useVoucherFromWallet('${v.code}')`}">
                        ${isSelected ? 'Bỏ chọn' : 'Dùng ngay'}
                    </button>
                </div>
            `;
        });
    }
    document.getElementById("voucher-wallet-modal").style.display = "flex";
}

function useVoucherFromWallet(code) {
    const v = studentVouchers.find(item => item.code === code && !item.isUsed);
    if (v) {
        discountAmount = v.discount;
        appliedVoucherCode = v.code;
        document.getElementById("voucher-code").value = v.code;
        showToast(`Đã áp dụng ${v.name}!`);
        closeModal('voucher-wallet-modal');
        renderCustomCart();
    }
}

function removeAppliedVoucher() {
    discountAmount = 0;
    appliedVoucherCode = "";
    document.getElementById("voucher-code").value = "";
    showToast("Đã hủy áp dụng voucher!");
    closeModal('voucher-wallet-modal');
    renderCustomCart();
}

/* ==================== VÒNG QUAY CANVAS ==================== */
function openWheelModal() {
    document.getElementById("wheel-modal").style.display = "flex";
    drawWheel();
}

function drawWheel() {
    const canvas = document.getElementById("wheel-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const numPrizes = prizes.length;
    const arc = (2 * Math.PI) / numPrizes;

    ctx.clearRect(0, 0, 280, 280);

    for (let i = 0; i < numPrizes; i++) {
        const angle = i * arc;
        ctx.beginPath();
        ctx.fillStyle = prizes[i].color;
        ctx.moveTo(140, 140);
        ctx.arc(140, 140, 140, angle, angle + arc);
        ctx.fill();

        ctx.save();
        ctx.translate(140, 140);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px Segoe UI";
        ctx.fillText(prizes[i].name, 125, 4);
        ctx.restore();
    }
}

function spinWheel() {
    const btn = document.getElementById("btn-spin");
    const display = document.getElementById("wheel-display");
    const canvas = document.getElementById("wheel-canvas");

    btn.disabled = true;
    display.innerText = "⏳ Đang quay...";

    const selectedIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[selectedIndex];

    const numPrizes = prizes.length;
    const segmentAngle = 360 / numPrizes;
    const prizeCenterAngle = selectedIndex * segmentAngle + segmentAngle / 2;

    const targetAngle = 360 - prizeCenterAngle - 90;
    const fullRounds = 5 * 360;

    currentWheelRotation += fullRounds + (targetAngle - (currentWheelRotation % 360));
    if (currentWheelRotation < fullRounds) currentWheelRotation += fullRounds;

    canvas.style.transform = `rotate(${currentWheelRotation}deg)`;

    setTimeout(() => {
        display.innerText = "🎉 Bạn trúng: " + prize.name;

        if (prize.discount > 0) {
            const voucherCode = "SPIN_" + Math.random().toString(36).substr(2, 6).toUpperCase();
            studentVouchers.unshift({
                code: voucherCode,
                name: "Voucher " + prize.name,
                discount: prize.discount,
                isUsed: false
            });
            saveStudentVouchers();
            showToast(`🎁 Đã lưu Voucher ${prize.name} vào Kho!`);
        } else {
            showToast("Chúc bạn may mắn lần sau!");
        }

        btn.disabled = false;
    }, 4000);
}

/* ==================== QUẢN LÝ TÀI KHOẢN & VÍ ==================== */
function openLoginModal() {
    document.getElementById("login-modal").style.display = "flex";
}

function handleLogin() {
    const id = document.getElementById("login-id").value.trim();
    if (!id) {
        alert("Vui lòng nhập Mã Sinh Viên!");
        return;
    }
    CURRENT_STUDENT_ID = id;
    localStorage.setItem("CURRENT_STUDENT_ID", id);

    document.getElementById("auth-buttons").style.display = "none";
    document.getElementById("user-info").style.display = "flex";
    closeModal('login-modal');

    fetch(`${API_BASE}/students/${CURRENT_STUDENT_ID}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.name) {
                currentStudentBalance = data.balance || 0;
                document.getElementById("sv-name").innerText = data.name;
                document.getElementById("sv-id").innerText = data.id;
                document.getElementById("sv-room").innerText = data.room || "A101";
                document.getElementById("sv-balance").innerText = currentStudentBalance.toLocaleString() + " VNĐ";
                document.getElementById("room-input").value = data.room || "A101";
            }
        })
        .catch(() => {
            currentStudentBalance = 200000;
            document.getElementById("sv-name").innerText = "Sinh Viên " + id;
            document.getElementById("sv-id").innerText = id;
            document.getElementById("sv-room").innerText = "A101";
            document.getElementById("sv-balance").innerText = "200,000 VNĐ";
            document.getElementById("room-input").value = "A101";
        });

    loadStudentVouchers();
    loadCart();
    showToast("Đăng nhập thành công!");
}

function logout() {
    CURRENT_STUDENT_ID = null;
    localStorage.removeItem("CURRENT_STUDENT_ID");
    document.getElementById("auth-buttons").style.display = "block";
    document.getElementById("user-info").style.display = "none";
    document.getElementById("cart-items").innerHTML = `<p class="empty-text">Vui lòng đăng nhập để xem giỏ hàng</p>`;
    loadStudentVouchers();
    loadFoods();
    showToast("Đã đăng xuất!");
}

function loadStudent() {
    if (!CURRENT_STUDENT_ID) return;
    fetch(`${API_BASE}/students/${CURRENT_STUDENT_ID}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.name) {
                currentStudentBalance = data.balance || 0;
                document.getElementById("sv-name").innerText = data.name;
                document.getElementById("sv-id").innerText = data.id;
                document.getElementById("sv-room").innerText = data.room || "--";
                document.getElementById("sv-balance").innerText = currentStudentBalance.toLocaleString() + " VNĐ";
                document.getElementById("room-input").value = data.room || "";
            }
        });
}

function openWalletHistoryModal() {
    const list = document.getElementById("wallet-history-list");
    if (!list) return;
    list.innerHTML = "";
    if (walletLogs.length === 0) {
        list.innerHTML = `<p style="color: #888; font-size: 12px; text-align: center;">Chưa có biến động số dư nào.</p>`;
    } else {
        walletLogs.forEach(log => {
            list.innerHTML += `
                <div class="wallet-item">
                    <span>${log.desc}</span>
                    <strong style="color:${log.amount > 0 ? '#10b981' : '#ef4444'}">${log.amount > 0 ? '+' : ''}${log.amount.toLocaleString()} VNĐ</strong>
                </div>
            `;
        });
    }
    document.getElementById("wallet-history-modal").style.display = "flex";
}

function openTopupModal() {
    if (!CURRENT_STUDENT_ID) { openLoginModal(); return; }
    document.getElementById("topup-modal").style.display = "flex";
}

function topupBalance(amount) {
    if (!CURRENT_STUDENT_ID) return;
    fetch(`${API_BASE}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: CURRENT_STUDENT_ID, amount: amount })
    })
        .then(res => res.json())
        .then(data => {
            currentStudentBalance = data.balance;
            document.getElementById("sv-balance").innerText = currentStudentBalance.toLocaleString() + " VNĐ";
            walletLogs.unshift({ desc: "Nạp tiền vào ví KTX", amount: amount });
            showToast(`Đã nạp +${amount.toLocaleString()} VNĐ vào ví KTX!`);
            closeModal('topup-modal');
        })
        .catch(() => {
            currentStudentBalance += amount;
            document.getElementById("sv-balance").innerText = currentStudentBalance.toLocaleString() + " VNĐ";
            walletLogs.unshift({ desc: "Nạp tiền vào ví KTX", amount: amount });
            showToast(`Đã nạp tạm +${amount.toLocaleString()} VNĐ!`);
            closeModal('topup-modal');
        });
}

function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById("theme-btn");
    if (body.getAttribute("data-theme") === "dark") {
        body.removeAttribute("data-theme");
        btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        body.setAttribute("data-theme", "dark");
        btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
}

function showToast(msg) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
}

/* ==================== THỰC ĐƠN ==================== */
function loadFoods() {
    const defaultFoods = [
        { id: "F01", name: "Cơm tấm sườn nướng", price: 30000, available: true, imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80" },
        { id: "F02", name: "Bún bò Huế đặc biệt", price: 35000, available: true, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&q=80" },
        { id: "F04", name: "Trà sữa thái xanh", price: 15000, available: true, imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80" },
        { id: "F05", name: "Bánh mì thịt nướng", price: 20000, available: true, imageUrl: "https://images.unsplash.com/photo-1626844131082-256783844137?w=500&q=80" },
        { id: "F10", name: "Xôi xéo thập cẩm", price: 20000, available: true, imageUrl: "https://images.unsplash.com/photo-1600454309261-3dc9b7597637?w=500&q=80" },
        { id: "F06", name: "Bún đậu mắm tôm", price: 40000, available: true, imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80" },
        { id: "F07", name: "Phở bò tái lăn", price: 40000, available: true, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&q=80" },
        { id: "F08", name: "Trà đào cam sả", price: 20000, available: true, imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80" },
        { id: "CB01", name: "Combo Phòng 4 Người (4 Cơm + 4 Trà đá)", price: 110000, available: true, imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80" },
        { id: "CB02", name: "Combo Đêm Sinh Viên (2 Trà sữa + Bánh mì)", price: 45000, available: true, imageUrl: "https://images.unsplash.com/photo-1558857563-b371033873b8?w=500&q=80" }
    ];

    fetch(`${API_BASE}/foods`)
        .then(res => res.json())
        .then(foods => {
            if (Array.isArray(foods) && foods.length > 0) {
                const combos = [
                    { id: "CB01", name: "Combo Phòng 4 Người (4 Cơm + 4 Trà đá)", price: 110000, available: true, imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80" },
                    { id: "CB02", name: "Combo Đêm Sinh Viên (2 Trà sữa + Bánh mì)", price: 45000, available: true, imageUrl: "https://images.unsplash.com/photo-1558857563-b371033873b8?w=500&q=80" }
                ];
                allFoods = [...foods, ...combos];
            } else {
                allFoods = defaultFoods;
            }
            filterFoods();
        })
        .catch(() => {
            allFoods = defaultFoods;
            filterFoods();
        });
}

function filterCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterFoods();
}

function filterFoods() {
    const kw = document.getElementById("search-input").value.toLowerCase();
    const sortSelect = document.getElementById("sort-select");
    const sortType = sortSelect ? sortSelect.value : "DEFAULT";
    let filtered = allFoods.filter(f => f.name.toLowerCase().includes(kw));

    const currentHour = new Date().getHours();

    if (currentCategory === 'SMART') {
        if (currentHour >= 5 && currentHour < 10) {
            filtered = filtered.filter(f => f.name.toLowerCase().includes("bánh mì") || f.name.toLowerCase().includes("phở") || f.name.toLowerCase().includes("xôi"));
            showToast("💡 Khung giờ Sáng: Ưu tiên gợi ý Bánh mì, Xôi, Phở!");
        } else if (currentHour >= 10 && currentHour < 20) {
            filtered = filtered.filter(f => f.name.toLowerCase().includes("cơm") || f.name.toLowerCase().includes("bún"));
            showToast("💡 Khung giờ Trưa/Tối: Ưu tiên gợi ý Cơm & Bún!");
        } else {
            filtered = filtered.filter(f => f.name.toLowerCase().includes("trà") || f.name.toLowerCase().includes("combo"));
            showToast("💡 Khung giờ Đêm: Ưu tiên gợi ý Trà sữa & Ăn vặt!");
        }
    }
    else if (currentCategory === 'COMBO') filtered = filtered.filter(f => f.name.toLowerCase().includes("combo"));
    else if (currentCategory === 'COM') filtered = filtered.filter(f => f.name.toLowerCase().includes("cơm") || f.name.toLowerCase().includes("bánh mì") || f.name.toLowerCase().includes("xôi"));
    else if (currentCategory === 'BUN') filtered = filtered.filter(f => f.name.toLowerCase().includes("bún") || f.name.toLowerCase().includes("mì") || f.name.toLowerCase().includes("phở"));
    else if (currentCategory === 'DRINK') filtered = filtered.filter(f => f.name.toLowerCase().includes("trà") || f.name.toLowerCase().includes("nước"));
    else if (currentCategory === 'FAV') filtered = filtered.filter(f => favoriteFoods.has(f.id));

    if (sortType === 'ASC') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortType === 'DESC') {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderFoods(filtered);
}

function toggleFavorite(id, icon) {
    if (favoriteFoods.has(id)) {
        favoriteFoods.delete(id);
        icon.classList.remove("active", "fa-solid");
        icon.classList.add("fa-regular");
        showToast("Đã xóa khỏi danh mục yêu thích!");
    } else {
        favoriteFoods.add(id);
        icon.classList.add("active", "fa-solid");
        icon.classList.remove("fa-regular");
        showToast("Đã lưu vào danh mục yêu thích!");
    }
}

function renderFoods(foods) {
    const container = document.getElementById("food-list");
    if (!container) return;
    container.innerHTML = "";
    if (!foods || foods.length === 0) {
        container.innerHTML = `<p class="empty-text" style="grid-column: 1/-1;">Không tìm thấy món ăn phù hợp.</p>`;
        return;
    }
    foods.forEach(f => {
        const isFav = favoriteFoods.has(f.id);
        const imgUrl = f.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80";
        const isAvailable = f.available !== false;

        container.innerHTML += `
            <div class="food-card" style="${!isAvailable ? 'opacity: 0.6;' : ''}">
                <div class="food-img-holder" onclick="openFoodDetail('${f.id}')">
                    <img src="${imgUrl}" alt="${f.name}">
                    <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart fav-icon ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite('${f.id}', this)"></i>
                    <div class="food-rating">4.8 ★</div>
                </div>
                <div class="food-info">
                    <div class="food-title">${f.name}</div>
                    <div class="food-price">${f.price.toLocaleString()} VNĐ</div>
                </div>
                <button class="btn-add" onclick="addToCart('${f.id}', 1)" ${!isAvailable ? 'disabled' : ''}>
                    ${isAvailable ? '<i class="fa-solid fa-cart-plus"></i> Thêm món' : 'Hết hàng'}
                </button>
            </div>
        `;
    });
}

/* ==================== TOPPING & GIỔ HÀNG ==================== */
function openFoodDetail(id) {
    selectedFoodForDetail = allFoods.find(f => f.id === id);
    if (!selectedFoodForDetail) return;
    selectedToppings = [];

    let isDrink = selectedFoodForDetail.name.includes("Trà") || selectedFoodForDetail.name.includes("nước");

    let toppingOptions = isDrink ? [
        { name: "Trân châu đen", price: 5000 },
        { name: "Thạch trái cây", price: 5000 }
    ] : [
        { name: "Trứng ốp la", price: 5000 },
        { name: "Chả trứng béo", price: 5000 }
    ];

    let toppingHtml = `
        <div class="topping-group">
            <label style="font-weight:bold; font-size:13px;">Tùy Chọn Topping Thêm (+5.000đ):</label>
            ${toppingOptions.map((t) => `
                <div class="topping-item" style="display:flex; justify-content:space-between; margin-top:8px; font-size:12px;">
                    <label style="cursor:pointer;">
                        <input type="checkbox" onchange="toggleToppingChoice('${t.name}', ${t.price}, this.checked)"> ${t.name}
                    </label>
                    <span style="color:#888;">+${t.price.toLocaleString()}đ</span>
                </div>
            `).join('')}
        </div>
    `;

    document.getElementById("food-detail-body").innerHTML = `
        <img src="${selectedFoodForDetail.imageUrl}" style="width:100%; height:180px; object-fit:cover; border-radius:12px; margin-bottom:12px;">
        <h3 style="font-size:18px;">${selectedFoodForDetail.name}</h3>
        <p id="modal-food-price" style="color:#ff5722; font-weight:bold; font-size:16px; margin-bottom:8px;">${selectedFoodForDetail.price.toLocaleString()} VNĐ</p>
        <p style="font-size:12px; color:#666; line-height:1.5;">Món ăn chế biến nóng hổi, vệ sinh an toàn thực phẩm, giao nhanh tận phòng KTX.</p>
        ${toppingHtml}
    `;
    document.getElementById("food-detail-modal").style.display = "flex";
}

function toggleToppingChoice(name, price, isChecked) {
    if (isChecked) {
        selectedToppings.push({ name: name, price: price });
    } else {
        selectedToppings = selectedToppings.filter(t => t.name !== name);
    }

    let extraPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    let totalPrice = selectedFoodForDetail.price + extraPrice;
    document.getElementById("modal-food-price").innerText = totalPrice.toLocaleString() + " VNĐ";
}

function addCurrentFoodWithToppings() {
    if (!selectedFoodForDetail) return;

    let extraPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    let extraNames = selectedToppings.map(t => t.name).join(", ");

    let foodWithTopping = {
        id: selectedFoodForDetail.id,
        name: extraNames ? `${selectedFoodForDetail.name} (+${extraNames})` : selectedFoodForDetail.name,
        price: selectedFoodForDetail.price + extraPrice,
        imageUrl: selectedFoodForDetail.imageUrl
    };

    addToCartCustom(foodWithTopping, 1);
    closeModal('food-detail-modal');
}

function addToCartCustom(customFood, q) {
    if (!CURRENT_STUDENT_ID) { openLoginModal(); return; }

    let existing = customCartItems.find(i => i.food.name === customFood.name);
    if (existing) {
        existing.quantity += q;
        if (existing.quantity <= 0) {
            customCartItems = customCartItems.filter(i => i.food.name !== customFood.name);
        }
    } else if (q > 0) {
        customCartItems.push({ food: customFood, quantity: q });
    }

    showToast("Đã cập nhật giỏ hàng!");
    renderCustomCart();
}

function renderCustomCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;
    container.innerHTML = "";
    let subtotal = 0;
    let totalItems = 0;

    if (customCartItems.length > 0) {
        customCartItems.forEach((item, index) => {
            const itemTotal = item.food.price * item.quantity;
            subtotal += itemTotal;
            totalItems += item.quantity;
            container.innerHTML += `
                <div class="cart-item">
                    <div>
                        <div class="cart-item-title">${item.food.name}</div>
                        <div class="cart-item-price">${item.food.price.toLocaleString()} VNĐ</div>
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateCustomCartQty(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCustomCartQty(${index}, 1)">+</button>
                    </div>
                </div>
            `;
        });
    } else {
        container.innerHTML = `<p class="empty-text">Giỏ hàng đang trống</p>`;
        discountAmount = 0;
        appliedVoucherCode = "";
    }

    document.getElementById("cart-count-badge").innerText = totalItems;
    subtotal = Math.max(0, subtotal);
    const total = Math.max(0, subtotal - discountAmount);

    document.getElementById("cart-subtotal").innerText = subtotal.toLocaleString() + " VNĐ";
    document.getElementById("cart-discount").innerText = "-" + (subtotal > 0 ? discountAmount.toLocaleString() : "0") + " VNĐ";
    document.getElementById("cart-total").innerText = total.toLocaleString() + " VNĐ";
}

function updateCustomCartQty(index, q) {
    if (customCartItems[index]) {
        customCartItems[index].quantity += q;
        if (customCartItems[index].quantity <= 0) {
            customCartItems.splice(index, 1);
        }
        renderCustomCart();
    }
}

function loadCart() { renderCustomCart(); }

function addToCart(foodId, q) {
    let food = allFoods.find(f => f.id === foodId);
    if (food) addToCartCustom(food, q);
}

function clearCart() {
    customCartItems = [];
    discountAmount = 0;
    appliedVoucherCode = "";
    document.getElementById("voucher-code").value = "";
    showToast("Đã xóa sạch giỏ hàng!");
    renderCustomCart();
}

function applyVoucher() {
    const inputCode = document.getElementById("voucher-code").value.trim().toUpperCase();
    const v = studentVouchers.find(item => item.code.toUpperCase() === inputCode && !item.isUsed);

    if (v) {
        discountAmount = v.discount;
        appliedVoucherCode = v.code;
        showToast(`Áp dụng ${v.name} thành công!`);
    } else {
        showToast("Mã ưu đãi không chính xác hoặc đã sử dụng!");
    }
    renderCustomCart();
}

/* ==================== ĐẶT HÀNG & BẢN ĐỒ SHIPPERS ==================== */
function checkout() {
    if (!CURRENT_STUDENT_ID) { openLoginModal(); return; }
    if (customCartItems.length === 0) { alert("Giỏ hàng của bạn đang trống!"); return; }

    const paymentMethod = document.getElementById("payment-method").value;
    const deliveryTime = document.getElementById("delivery-time").value;
    const orderNote = document.getElementById("order-note").value.trim();
    const building = document.getElementById("building-select").value;
    const room = document.getElementById("room-input").value.trim() || "A101";

    let subtotal = customCartItems.reduce((sum, item) => sum + (item.food.price * item.quantity), 0);
    let totalAmount = Math.max(0, subtotal - discountAmount);
    let orderId = "ORD-" + Math.random().toString(36).substr(2, 8).toUpperCase();
    let otpCode = Math.floor(1000 + Math.random() * 9000);

    const order = {
        id: orderId,
        otp: otpCode,
        building: building,
        room: room,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod === 'WALLET' ? 'Ví sinh viên KTX' : (paymentMethod === 'BANK' ? 'Chuyển khoản QR' : 'Tiền mặt'),
        statusStep: 2,
        isReviewed: false,
        countdownSeconds: 900,
        shipperPos: 10
    };

    if (paymentMethod === "WALLET") {
        if (currentStudentBalance < totalAmount) {
            alert("Số dư ví KTX không đủ! Vui lòng nạp thêm tiền.");
            return;
        }
        currentStudentBalance -= totalAmount;
        document.getElementById("sv-balance").innerText = currentStudentBalance.toLocaleString() + " VNĐ";
        walletLogs.unshift({ desc: `Thanh toán đơn hàng #${order.id}`, amount: -totalAmount });
    }

    const qrBox = document.getElementById("qr-box");
    if (paymentMethod === "BANK") {
        document.getElementById("vietqr-img").src = "qr-bank.jpg";
        qrBox.style.display = "block";
    } else {
        qrBox.style.display = "none";
    }

    document.getElementById("invoice-details").innerHTML = `
        <p><strong>Mã Đơn Hàng:</strong> ${order.id}</p>
        <p><strong>🔑 Mã OTP Nhận Món:</strong> <span style="font-size:16px; color:#10b981; font-weight:bold;">${order.otp}</span> (Đọc cho Shipper)</p>
        <p><strong>Địa Chỉ Giao:</strong> Tòa ${building} - Phòng ${room}</p>
        <p><strong>Thanh Toán:</strong> ${order.paymentMethod}</p>
        <p><strong>Thời Gian Giao:</strong> ${deliveryTime === 'ASAP' ? '⚡ Giao ngay (15-20p)' : deliveryTime}</p>
        <p><strong>Ghi Chú Bếp:</strong> ${orderNote || 'Không có'}</p>
        <p><strong>Tổng Tiền:</strong> <span style="color:#ff5722;font-weight:bold;">${order.totalAmount.toLocaleString()} VNĐ</span></p>
    `;
    document.getElementById("order-modal").style.display = "flex";

    if (appliedVoucherCode) {
        const usedV = studentVouchers.find(v => v.code === appliedVoucherCode);
        if (usedV) usedV.isUsed = true;
        saveStudentVouchers();
    }

    const sysOrders = JSON.parse(localStorage.getItem("ALL_SYSTEM_ORDERS") || "[]");
    sysOrders.unshift(order);
    localStorage.setItem("ALL_SYSTEM_ORDERS", JSON.stringify(sysOrders));

    customCartItems = [];
    discountAmount = 0;
    appliedVoucherCode = "";
    document.getElementById("voucher-code").value = "";

    orderHistory.unshift(order);
    renderHistory();
    renderCustomCart();

    startOrderTimer(order);

    setTimeout(() => { order.statusStep = 3; order.shipperPos = 50; renderHistory(); }, 2500);
    setTimeout(() => {
        order.statusStep = 4;
        order.shipperPos = 90;
        renderHistory();
        showToast(`Món ăn đơn #${order.id} đã được giao tới phòng! Read OTP: ${order.otp}`);
    }, 5000);
}

function startOrderTimer(order) {
    let timer = setInterval(() => {
        if (order.countdownSeconds <= 0 || order.statusStep === 4) {
            clearInterval(timer);
        } else {
            order.countdownSeconds--;
            let mins = Math.floor(order.countdownSeconds / 60);
            let secs = order.countdownSeconds % 60;
            let timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            let el = document.getElementById(`timer-${order.id}`);
            if (el) el.innerText = `⏱️ Dự kiến giao sau: ${timeStr}`;
        }
    }, 1000);
}

function cancelOrder(orderId) {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

    const idx = orderHistory.findIndex(o => o.id === orderId);
    if (idx !== -1) {
        const canceled = orderHistory[idx];
        if (canceled.paymentMethod === "Ví sinh viên KTX") {
            currentStudentBalance += canceled.totalAmount;
            document.getElementById("sv-balance").innerText = currentStudentBalance.toLocaleString() + " VNĐ";
            walletLogs.unshift({ desc: `Hoàn tiền hủy đơn #${canceled.id}`, amount: canceled.totalAmount });
        }
        orderHistory.splice(idx, 1);
        showToast("Đã hủy đơn hàng và hoàn tiền!");
        renderHistory();
    }
}

function renderHistory() {
    const hList = document.getElementById("history-list");
    if (!hList) return;
    hList.innerHTML = "";
    if (orderHistory.length === 0) {
        hList.innerHTML = `<p class="empty-text">Chưa có đơn hàng nào trong phiên làm việc này.</p>`;
        return;
    }
    orderHistory.forEach(o => {
        const step = o.statusStep || 2;
        const isCompleted = step === 4;
        const pos = o.shipperPos || 10;

        hList.innerHTML += `
            <div class="history-card">
                <div style="width: 100%;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong>Mã đơn: ${o.id}</strong> 
                            <span style="background:#10b981; color:white; padding:2px 6px; border-radius:4px; font-size:11px; margin-left:5px;">OTP: ${o.otp}</span>
                        </div>
                        <div>
                            <span style="color:#ff5722; font-weight:bold; margin-right: 8px;">${o.totalAmount.toLocaleString()} VNĐ</span>
                            ${!isCompleted ? `<button class="btn-cancel-order" onclick="cancelOrder('${o.id}')">Hủy đơn</button>` : ''}
                            ${isCompleted && !o.isReviewed ? `<button class="btn-review" onclick="openReviewModal('${o.id}')">★ Viết đánh giá</button>` : ''}
                            ${o.isReviewed ? `<span style="font-size:11px; color:#10b981; font-weight:bold;">✓ Đã đánh giá</span>` : ''}
                        </div>
                    </div>
                    <div id="timer-${o.id}" style="font-size:11px; color:#3b82f6; font-weight:bold; margin-top:4px;">⏱️ Dự kiến giao sau: 15:00</div>
                    
                    <div class="shipper-map">
                        <div class="map-road"></div>
                        <div class="map-pin" style="left: 10%;"><i class="fa-solid fa-kitchen-set"></i><small>Bếp</small></div>
                        <div class="map-pin" style="left: 50%;"><i class="fa-solid fa-torii-gate"></i><small>Cổng KTX</small></div>
                        <div class="map-pin" style="left: 90%;"><i class="fa-solid fa-building-user"></i><small>Phòng ${o.room || 'A101'}</small></div>
                        <div class="shipper-icon" style="left: ${pos}%;"><i class="fa-solid fa-motorcycle"></i></div>
                    </div>

                    <div class="progress-tracker">
                        <div class="progress-step ${step >= 1 ? 'active' : ''}"><i class="fa-solid fa-file-invoice"></i>Đã nhận</div>
                        <div class="progress-step ${step >= 2 ? 'active' : ''}"><i class="fa-solid fa-kitchen-set"></i>Đang nấu</div>
                        <div class="progress-step ${step >= 3 ? 'active' : ''}"><i class="fa-solid fa-person-biking"></i>Đang giao</div>
                        <div class="progress-step ${step >= 4 ? 'active' : ''}"><i class="fa-solid fa-circle-check"></i>Hoàn tất</div>
                    </div>
                </div>
            </div>
        `;
    });
}

function openReviewModal(orderId) {
    currentReviewOrderId = orderId;
    document.getElementById("review-order-id").innerText = "Mã đơn: " + orderId;
    document.getElementById("review-text").value = "";
    setRating(5);
    document.getElementById("review-modal").style.display = "flex";
}

function setRating(stars) {
    currentRating = stars;
    const starBtns = document.querySelectorAll(".star-btn");
    starBtns.forEach((btn, index) => {
        if (index < stars) {
            btn.classList.add("fa-solid");
            btn.classList.remove("fa-regular");
        } else {
            btn.classList.remove("fa-solid");
            btn.classList.add("fa-regular");
        }
    });
}

function submitReview() {
    const order = orderHistory.find(o => o.id === currentReviewOrderId);
    if (order) {
        order.isReviewed = true;
        renderHistory();
        showToast(`Cảm ơn bạn đã gửi đánh giá ${currentRating}★ cho nhà bếp!`);
    }
    closeModal('review-modal');
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}