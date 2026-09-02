package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import model.Order;
import service.OrderService;
import utils.GsonUtils;

import java.io.InputStreamReader;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class OrderHandler implements HttpHandler {
    private final OrderService orderService = new OrderService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        try {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                Map request = GsonUtils.getGson().fromJson(new InputStreamReader(exchange.getRequestBody()), Map.class);
                String studentId = (String) request.get("studentId");
                String paymentMethod = (String) request.get("paymentMethod");

                Order order = orderService.checkout(studentId, paymentMethod);
                sendResponse(exchange, 200, GsonUtils.getGson().toJson(order));
            } else if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 200, GsonUtils.getGson().toJson(orderService.getAllOrders()));
            } else {
                sendResponse(exchange, 405, "{\"error\": \"Method không hỗ trợ\"}");
            }
        } catch (Exception e) {
            sendResponse(exchange, 400, "{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}