const CURRENT_STUDENT_ID = "SV001";
const API_BASE = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", () => {
    loadStudent();
    loadFoods();
    loadCart();
});

function loadStudent() {
    fetch(`${API_BASE}/students/${CURRENT_STUDENT_ID}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("sv-name").innerText = data.name;
            document.getElementById("sv-room").innerText = data.room;
            document.getElementById("sv-balance").innerText = data.balance.toLocaleString();
        });
}

function loadFoods() {
    fetch(`${API_BASE}/foods`)
        .then(res => res.json())
        .then(renderFoods);
}

function searchFood() {
    const kw = document.getElementById("search-box").value;
    fetch(`${API_BASE}/foods?search=${kw}`)
        .then(res => res.json())
        .then(renderFoods);
}

function renderFoods(foods) {
    const container = document.getElementById("food-list");
    container.innerHTML = foods.map(f => `
        <div class="food-card">
            <div>
                <div class="food-title">${f.name}</div>
                <div class="food-price">${f.price.toLocaleString()} VNĐ</div>
            </div>
            ${f.available
        ? `<button onclick="addToCart('${f.id}')" class="btn-add">Thêm vào giỏ</button>`
        : `<button disabled class="btn-add">Hết hàng</button>`}
        </div>
    `).join("");
}

function addToCart(foodId) {
    fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: CURRENT_STUDENT_ID, foodId: foodId, quantity: 1 })
    }).then(res => res.json()).then(res => {
        if (res.error) alert(res.error);
        else loadCart();
    });
}

function loadCart() {
    fetch(`${API_BASE}/cart?studentId=${CURRENT_STUDENT_ID}`)
        .then(res => res.json())
        .then(cart => {
            const tbody = document.getElementById("cart-items");
            if (!cart.items || cart.items.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted); padding: 20px;">Giỏ hàng rỗng</td></tr>`;
            } else {
                tbody.innerHTML = cart.items.map(i => `
                    <tr>
                        <td><strong>${i.food.name}</strong></td>
                        <td>x${i.quantity}</td>
                        <td>${i.subtotal.toLocaleString()}</td>
                        <td><button onclick="removeFromCart('${i.food.id}')" class="btn-delete">Xóa</button></td>
                    </tr>
                `).join("");
            }
            document.getElementById("cart-total").innerText = cart.totalAmount.toLocaleString() + " VNĐ";
        });
}

function removeFromCart(foodId) {
    fetch(`${API_BASE}/cart?studentId=${CURRENT_STUDENT_ID}&foodId=${foodId}`, { method: "DELETE" })
        .then(() => loadCart());
}

function checkout() {
    const method = document.getElementById("payment-method").value;
    fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: CURRENT_STUDENT_ID, paymentMethod: method })
    }).then(res => res.json()).then(res => {
        if (res.error) {
            alert("Lỗi đặt hàng: " + res.error);
        } else {
            alert("🎉 Đặt hàng thành công!\nMã đơn: " + res.orderId);
            loadStudent();
            loadCart();
        }
    });
}