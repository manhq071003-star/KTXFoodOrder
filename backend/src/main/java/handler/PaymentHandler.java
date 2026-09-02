package handler;

import com.sun.net.httpserver.HttpExchange;
package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class PaymentHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String json = "[\n" +
                "  {\"code\": \"WALLET\", \"name\": \"Ví sinh viên\"},\n" +
                "  {\"code\": \"CASH\", \"name\": \"Tiền mặt khi nhận hàng\"},\n" +
                "  {\"code\": \"BANK\", \"name\": \"Chuyển khoản ngân hàng\"}\n" +
                "]";
        sendResponse(exchange, 200, json);
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