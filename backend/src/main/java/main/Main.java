package main;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import handler.OrderHandler;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws IOException {
        int port = 8080;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        OrderHandler orderHandler = new OrderHandler();

        // REST API Endpoint riêng do Thành viên 5 quản lý
        server.createContext("/api/orders", exchange -> sendJsonResponse(exchange, orderHandler.handleGetAllOrders()));

        // Phục vụ file tĩnh Frontend Web (HTML/CSS/JS)
        server.createContext("/", new StaticFileHandler());

        server.setExecutor(null);
        System.out.println("====================================================");
        System.out.println("🚀 [MEMBER 5 CORE SERVER] Server đang chạy tại:");
        System.out.println("👉 http://localhost:" + port);
        System.out.println("====================================================");
        server.start();
    }

    private static void sendJsonResponse(HttpExchange exchange, String jsonResponse) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        byte[] bytes = jsonResponse.getBytes("UTF-8");
        exchange.sendResponseHeaders(200, bytes.length);

        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/")) path = "/index.html";

            File file = new File("frontend" + path);
            if (!file.exists()) file = new File("backend/frontend" + path);

            if (file.exists() && !file.isDirectory()) {
                String contentType = "text/html";
                if (path.endsWith(".css")) contentType = "text/css";
                else if (path.endsWith(".js")) contentType = "application/javascript";

                exchange.getResponseHeaders().set("Content-Type", contentType + "; charset=UTF-8");
                exchange.sendResponseHeaders(200, file.length());

                FileInputStream fs = new FileInputStream(file);
                OutputStream os = exchange.getResponseBody();
                byte[] buffer = new byte[1024];
                int count;
                while ((count = fs.read(buffer)) >= 0) {
                    os.write(buffer, 0, count);
                }
                fs.close();
                os.close();
            } else {
                String msg = "404 Not Found";
                byte[] bytes = msg.getBytes("UTF-8");
                exchange.sendResponseHeaders(404, bytes.length);

                OutputStream os = exchange.getResponseBody();
                os.write(bytes);
                os.close();
            }
        }
    }
}