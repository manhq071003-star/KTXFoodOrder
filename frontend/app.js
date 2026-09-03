/* ==========================================================================
   MODULE 1: VÒNG QUAY MAY MẮN CANVAS 360° (Thành viên 4 phụ trách)
   ========================================================================== */

const segments = [
    "Voucher 10k",
    "Chúc bạn may mắn",
    "Voucher 5k",
    "Free Topping",
    "Chúc bạn may mắn",
    "Voucher 20k",
    "Giảm 50% Ship",
    "Chúc bạn may mắn"
];

const colors = [
    "#ff7675", "#fdcb6e", "#e17055", "#00b894",
    "#74b9ff", "#a29bfe", "#ffeaa7", "#fab1a0"
];

let startAngle = 0;
const arc = Math.PI / (segments.length / 2);
let spinTimeout = null;
let spinTime = 0;
let spinTimeTotal = 0;

function drawWheel() {
    const canvas = document.getElementById("wheelCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const outsideRadius = 140;
    const textRadius = 90;
    const insideRadius = 30;

    ctx.clearRect(0, 0, 300, 300);

    for (let i = 0; i < segments.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = colors[i];

        ctx.beginPath();
        ctx.arc(150, 150, outsideRadius, angle, angle + arc, false);
        ctx.arc(150, 150, insideRadius, angle + arc, angle, true);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = "#2d3436";
        ctx.font = "bold 11px sans-serif";
        ctx.translate(
            150 + Math.cos(angle + arc / 2) * textRadius,
            150 + Math.sin(angle + arc / 2) * textRadius
        );
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        const text = segments[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
    }
}

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI) / 180;
    drawWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    const degrees = (startAngle * 180) / Math.PI + 90;
    const arcd = (arc * 180) / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd);

    const resultText = segments[index];
    alert("🎉 BẠN ĐÃ TRÚNG: " + resultText);

    // Lưu Voucher vào LocalStorage
    if (resultText.includes("Voucher")) {
        localStorage.setItem("user_voucher", resultText);
    }
}

function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + ts * -3 + t * 3);
}

function spin() {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 4000;
    rotateWheel();
}


/* ==========================================================================
   MODULE 2: BẢN ĐỒ SHIPPER TRACKER REAL-TIME SIMULATOR (Thành viên 4 phụ trách)
   ========================================================================== */

let shipperProgress = 10; // Phần trăm quãng đường (10% = Bếp KTX)
let mapInterval = null;

function startShipperTracking() {
    const shipperIcon = document.getElementById("shipperIcon");
    const statusText = document.getElementById("shipperStatusText");
    if (!shipperIcon) return;

    shipperProgress = 10;
    shipperIcon.style.left = shipperProgress + "%";

    if (mapInterval) clearInterval(mapInterval);

    mapInterval = setInterval(() => {
        shipperProgress += 10;
        if (shipperProgress > 90) {
            shipperProgress = 90;
            clearInterval(mapInterval);
            if (statusText) statusText.innerText = "✅ Shipper đã giao món tới phòng KTX!";
        } else if (shipperProgress === 50) {
            if (statusText) statusText.innerText = "🛵 Shipper đang qua cổng bảo vệ KTX...";
        } else if (shipperProgress < 50) {
            if (statusText) statusText.innerText = "👨‍🍳 Nhà bếp đang chuẩn bị món...";
        } else {
            if (statusText) statusText.innerText = "🚀 Shipper đang lên tầng phòng bạn!";
        }

        shipperIcon.style.left = shipperProgress + "%";
    }, 2000); // Mỗi 2 giây tiến 10% quãng đường
}

// Khởi tạo vẽ Vòng quay khi load xong trang
window.addEventListener("load", () => {
    drawWheel();
});