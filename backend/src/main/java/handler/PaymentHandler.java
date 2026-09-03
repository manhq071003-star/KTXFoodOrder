package handler;

import com.sun.net.httpserver.*;
import java.io.*;
import java.nio.charset.StandardCharsets;

public class PaymentHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange ex) throws IOException {
        setCors(ex);
        if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) { ex.sendResponseHeaders(204, -1); return; }

        String json = "[\n" +
                "  {\"code\": \"WALLET\", \"name\": \"Ví sinh viên KTX\"},\n" +
                "  {\"code\": \"CASH\", \"name\": \"Tiền mặt khi nhận hàng\"},\n" +
                "  {\"code\": \"BANK\", \"name\": \"Chuyển khoản QR Bank\"}\n" +
                "]";
        sendResponse(ex, 200, json);
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