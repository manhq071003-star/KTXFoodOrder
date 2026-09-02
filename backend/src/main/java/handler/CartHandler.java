package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import service.CartService;
import utils.GsonUtils;

import java.io.InputStreamReader;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class CartHandler implements HttpHandler {
    private final CartService cartService = new CartService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        try {
            if ("GET".equalsIgnoreCase(method)) {
                String studentId = getQueryParam(exchange.getRequestURI().getQuery(), "studentId");
                String json = GsonUtils.getGson().toJson(cartService.getCart(studentId));
                sendResponse(exchange, 200, json);
            } else if ("POST".equalsIgnoreCase(method)) {
                Map request = GsonUtils.getGson().fromJson(new InputStreamReader(exchange.getRequestBody()), Map.class);
                String studentId = (String) request.get("studentId");
                String foodId = (String) request.get("foodId");
                int quantity = ((Double) request.get("quantity")).intValue();

                cartService.addToCart(studentId, foodId, quantity);
                sendResponse(exchange, 200, "{\"message\": \"Thêm món thành công\"}");
            } else if ("DELETE".equalsIgnoreCase(method)) {
                String studentId = getQueryParam(exchange.getRequestURI().getQuery(), "studentId");
                String foodId = getQueryParam(exchange.getRequestURI().getQuery(), "foodId");
                cartService.removeFromCart(studentId, foodId);
                sendResponse(exchange, 200, "{\"message\": \"Xóa thành công\"}");
            }
        } catch (Exception e) {
            sendResponse(exchange, 400, "{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    private String getQueryParam(String query, String param) {
        if (query == null) return "";
        for (String pair : query.split("&")) {
            String[] kv = pair.split("=");
            if (kv[0].equalsIgnoreCase(param)) return kv[1];
        }
        return "";
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