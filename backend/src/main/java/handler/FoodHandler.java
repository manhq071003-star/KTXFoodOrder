package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import model.Food;
import service.FoodService;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class FoodHandler implements HttpHandler {
    private final FoodService foodService = new FoodService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        String method = exchange.getRequestMethod();

        if ("OPTIONS".equalsIgnoreCase(method)) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if ("GET".equalsIgnoreCase(method)) {
            String jsonResponse = foodService.getAllFoodsAsJson();
            sendResponse(exchange, 200, jsonResponse);
        }
        else if ("POST".equalsIgnoreCase(method)) {
            InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
            BufferedReader br = new BufferedReader(isr);
            StringBuilder body = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) body.append(line);

            String req = body.toString();
            String id = parseJsonValue(req, "id");
            String name = parseJsonValue(req, "name");
            double price = Double.parseDouble(parseJsonValue(req, "price"));
            String imageUrl = parseJsonValue(req, "imageUrl");

            foodService.addFood(new Food(id, name, price, imageUrl, true));
            sendResponse(exchange, 200, "{\"message\":\"Thêm thành công\"}");
        }
        else if ("PUT".equalsIgnoreCase(method)) {
            String query = exchange.getRequestURI().getQuery();
            if (query != null) {
                String foodId = getQueryParam(query, "id");
                if (query.contains("available=")) {
                    boolean available = Boolean.parseBoolean(getQueryParam(query, "available"));
                    foodService.updateFoodStatus(foodId, available);
                } else if (query.contains("price=")) {
                    double price = Double.parseDouble(getQueryParam(query, "price"));
                    foodService.updateFoodPrice(foodId, price);
                }
                sendResponse(exchange, 200, "{\"message\":\"Cập nhật thành công\"}");
                return;
            }
            sendResponse(exchange, 400, "{\"error\":\"Tham số không hợp lệ\"}");
        }
        else if ("DELETE".equalsIgnoreCase(method)) {
            String query = exchange.getRequestURI().getQuery();
            if (query != null && query.contains("id=")) {
                String foodId = getQueryParam(query, "id");
                foodService.deleteFood(foodId);
                sendResponse(exchange, 200, "{\"message\":\"Xóa thành công\"}");
                return;
            }
            sendResponse(exchange, 400, "{\"error\":\"Tham số không hợp lệ\"}");
        }
        else {
            sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
        }
    }

    private String getQueryParam(String query, String key) {
        for (String pair : query.split("&")) {
            String[] p = pair.split("=");
            if (p.length == 2 && p[0].equals(key)) return p[1];
        }
        return "";
    }

    private String parseJsonValue(String json, String key) {
        String pattern = "\"" + key + "\":";
        int start = json.indexOf(pattern);
        if (start == -1) return "";
        start += pattern.length();
        if (json.charAt(start) == '"') {
            start++;
            int end = json.indexOf("\"", start);
            return json.substring(start, end);
        } else {
            int end = json.indexOf(",", start);
            if (end == -1) end = json.indexOf("}", start);
            return json.substring(start, end).trim();
        }
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }
}