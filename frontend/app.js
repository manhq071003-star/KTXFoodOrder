document.addEventListener("DOMContentLoaded", () => {
    fetchFoods();
});

function fetchFoods() {
    fetch("/api/foods")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("foods-container");
            if (!data || data.length === 0) {
                container.innerHTML = "<p>Không có món ăn nào trong thực đơn.</p>";
                return;
            }

            let html = "<div class='food-grid'>";
            data.forEach(food => {
                html += `
                    <div class="food-card">
                        <h3>${food.name}</h3>
                        <p class="category">Danh mục: <b>${food.category}</b></p>
                        <p class="price">${food.price.toLocaleString('vi-VN')} VNĐ</p>
                        <p class="status ${food.available ? 'available' : 'unavailable'}">
                            ${food.available ? '● Còn hàng' : '✕ Hết hàng'}
                        </p>
                    </div>
                `;
            });
            html += "</div>";
            container.innerHTML = html;
        })
        .catch(error => {
            console.error("Lỗi:", error);
            document.getElementById("foods-container").innerHTML = "<p style='color:red;'>Không thể kết nối đến Server!</p>";
        });
}