package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import service.StudentService;
import utils.GsonUtils;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class StudentHandler implements HttpHandler {
    private final StudentService studentService = new StudentService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        String studentId = path.substring(path.lastIndexOf("/") + 1);

        try {
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                String json = GsonUtils.getGson().toJson(studentService.getStudent(studentId));
                sendResponse(exchange, 200, json);
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