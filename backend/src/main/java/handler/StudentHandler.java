package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import config.Database;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class StudentHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        String method = exchange.getRequestMethod();

        if ("OPTIONS".equalsIgnoreCase(method)) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if ("GET".equalsIgnoreCase(method)) {
            String path = exchange.getRequestURI().getPath();
            String studentId = path.substring(path.lastIndexOf('/') + 1);

            try (Connection conn = Database.getConnection();
                 PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM students WHERE id = ?")) {
                pstmt.setString(1, studentId);
                ResultSet rs = pstmt.executeQuery();

                if (rs.next()) {
                    String json = String.format(
                            "{\"id\":\"%s\",\"name\":\"%s\",\"room\":\"%s\",\"balance\":%.0f}",
                            rs.getString("id"), rs.getString("name"), rs.getString("room"), rs.getDouble("balance")
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    String insert = "INSERT INTO students (id, name, room, balance) VALUES (?, ?, 'A101', 200000)";
                    try (PreparedStatement insStmt = conn.prepareStatement(insert)) {
                        insStmt.setString(1, studentId);
                        insStmt.setString(2, "Sinh Viên " + studentId);
                        insStmt.executeUpdate();
                    }
                    String json = String.format("{\"id\":\"%s\",\"name\":\"Sinh Viên %s\",\"room\":\"A101\",\"balance\":200000}", studentId, studentId);
                    sendResponse(exchange, 200, json);
                }
            } catch (Exception e) {
                e.printStackTrace();
                sendResponse(exchange, 500, "{\"error\":\"Database error\"}");
            }
        } else if ("POST".equalsIgnoreCase(method)) {
            InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
            BufferedReader br = new BufferedReader(isr);
            StringBuilder body = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) body.append(line);

            String req = body.toString();
            String studentId = parseJsonValue(req, "studentId");
            double amount = Double.parseDouble(parseJsonValue(req, "amount"));

            try (Connection conn = Database.getConnection();
                 PreparedStatement pstmt = conn.prepareStatement("UPDATE students SET balance = balance + ? WHERE id = ?")) {
                pstmt.setDouble(1, amount);
                pstmt.setString(2, studentId);
                pstmt.executeUpdate();

                try (PreparedStatement sel = conn.prepareStatement("SELECT balance FROM students WHERE id = ?")) {
                    sel.setString(1, studentId);
                    ResultSet rs = sel.executeQuery();
                    if (rs.next()) {
                        sendResponse(exchange, 200, String.format("{\"balance\":%.0f}", rs.getDouble("balance")));
                        return;
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            sendResponse(exchange, 400, "{\"error\":\"Cannot update balance\"}");
        }
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