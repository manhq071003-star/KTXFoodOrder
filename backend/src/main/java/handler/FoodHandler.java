package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import service.FoodService;
import utils.GsonUtils;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class FoodHandler implements HttpHandler {
    private final FoodService foodService = new FoodService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        try {
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                String response;

                if (query != null && query.startsWith("search=")) {
                    String keyword = query.split("=")[1];
                    response = GsonUtils.getGson().toJson(foodService.searchByName(keyword));
                } else {
                    response = GsonUtils.getGson().toJson(foodService.getAllFoods());
                }

                sendResponse(exchange, 200, response);
            } else {
                sendResponse(exchange, 405, "{\"error\": \"Method không hỗ trợ\"}");
            }
        } catch (Exception e) {
            sendResponse(exchange, 400, "{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}