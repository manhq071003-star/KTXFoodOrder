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
        if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            String query = exchange.getRequestURI().getQuery();
            Object responseData;

            if (query != null && query.startsWith("search=")) {
                String keyword = query.substring(7);
                responseData = foodService.searchByName(keyword);
            } else {
                responseData = foodService.getAllFoods();
            }

            String json = GsonUtils.getGson().toJson(responseData);
            sendResponse(exchange, 200, json);
        } else {
            sendResponse(exchange, 405, "{\"error\": \"Method không hỗ trợ\"}");
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