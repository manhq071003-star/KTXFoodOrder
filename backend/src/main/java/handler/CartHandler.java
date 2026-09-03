package handler;

import com.google.gson.JsonObject;
import com.sun.net.httpserver.*;
import service.CartService;
import utils.GsonUtils;

import java.io.*;
import java.nio.charset.StandardCharsets;

public class CartHandler implements HttpHandler {
    private final CartService cartService;

    public CartHandler(CartService cartService) { this.cartService = cartService; }

    @Override
    public void handle(HttpExchange ex) throws IOException {
        setCors(ex);
        if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { ex.sendResponseHeaders(204, -1); return; }

        String method = ex.getRequestMethod();
        try {
            if ("GET".equalsIgnoreCase(method)) {
                String id = getQueryParam(ex, "studentId");
                sendResponse(ex, 200, GsonUtils.getGson().toJson(cartService.getCart(id)));
            } else if ("POST".equalsIgnoreCase(method)) {
                JsonObject req = GsonUtils.getGson().fromJson(new InputStreamReader(ex.getRequestBody(), StandardCharsets.UTF_8), JsonObject.class);
                cartService.addToCart(req.get("studentId").getAsString(), req.get("foodId").getAsString(), req.has("quantity") ? req.get("quantity").getAsInt() : 1);
                sendResponse(ex, 200, "{\"message\":\"OK\"}");
            } else if ("DELETE".equalsIgnoreCase(method)) {
                String foodId = getQueryParam(ex, "foodId");
                String studentId = getQueryParam(ex, "studentId");
                if ("ALL".equalsIgnoreCase(foodId)) {
                    cartService.clearCart(studentId);
                } else {
                    cartService.removeFromCart(studentId, foodId);
                }
                sendResponse(ex, 200, "{\"message\":\"OK\"}");
            }
        } catch (Exception e) { sendResponse(ex, 400, "{\"error\":\"" + e.getMessage() + "\"}"); }
    }

    private String getQueryParam(HttpExchange ex, String key) {
        String q = ex.getRequestURI().getQuery();
        if (q != null) for (String p : q.split("&")) {
            String[] pair = p.split("=");
            if (pair.length > 1 && pair[0].equalsIgnoreCase(key)) return pair[1];
        }
        return "SV001";
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
        try (OutputStream os = ex.getResponseBody()) { os.write(b); }
    }
}