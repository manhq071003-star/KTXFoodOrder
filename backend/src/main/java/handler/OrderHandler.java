package handler;

import com.google.gson.JsonObject;
import com.sun.net.httpserver.*;
import model.Order;
import service.OrderService;
import utils.GsonUtils;

import java.io.*;
import java.nio.charset.StandardCharsets;

public class OrderHandler implements HttpHandler {
    private final OrderService orderService;

    public OrderHandler(OrderService orderService) {
        this.orderService = orderService;
    }

    @Override
    public void handle(HttpExchange ex) throws IOException {
        setCors(ex);

        // Xử lý Preflight Request (OPTIONS) cho kết nối CORS
        if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) {
            ex.sendResponseHeaders(204, -1);
            return;
        }

        try {
            if ("POST".equalsIgnoreCase(ex.getRequestMethod())) {
                // Đọc dữ liệu JSON gửi từ Frontend
                JsonObject req = GsonUtils.getGson().fromJson(
                        new InputStreamReader(ex.getRequestBody(), StandardCharsets.UTF_8),
                        JsonObject.class
                );

                String studentId = req.get("studentId").getAsString();
                String paymentMethod = req.get("paymentMethod").getAsString();

                // Đọc số tiền giảm giá (mặc định là 0.0 nếu người dùng không nhập mã)
                double discountAmount = req.has("discountAmount") ? req.get("discountAmount").getAsDouble() : 0.0;

                // Gọi OrderService tạo đơn hàng và tính tổng tiền đã trừ mã giảm giá
                Order order = orderService.createOrder(studentId, paymentMethod, discountAmount);

                sendResponse(ex, 200, GsonUtils.getGson().toJson(order));
            } else {
                sendResponse(ex, 405, "{\"error\":\"Method not allowed\"}");
            }
        } catch (Exception e) {
            sendResponse(ex, 400, "{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    private void setCors(HttpExchange ex) {
        ex.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        ex.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        ex.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
    }

    private void sendResponse(HttpExchange ex, int code, String resp) throws IOException {
        byte[] b = resp.getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        ex.sendResponseHeaders(code, b.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(b);
        }
    }
}