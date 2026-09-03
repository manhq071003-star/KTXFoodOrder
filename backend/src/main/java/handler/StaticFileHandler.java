package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

public class StaticFileHandler implements HttpHandler {
    private final String frontendPath;

    public StaticFileHandler(String frontendPath) {
        this.frontendPath = frontendPath;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        if (path.equals("/")) {
            path = "/index.html";
        }

        File file = new File(frontendPath + path);
        if (!file.exists() || file.isDirectory()) {
            String response = "404 Not Found";
            exchange.sendResponseHeaders(404, response.length());
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
            return;
        }

        String mime = "text/html";
        if (path.endsWith(".css")) mime = "text/css";
        else if (path.endsWith(".js")) mime = "text/javascript";
        else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) mime = "image/jpeg";
        else if (path.endsWith(".png")) mime = "image/png";

        exchange.getResponseHeaders().set("Content-Type", mime + "; charset=UTF-8");
        exchange.sendResponseHeaders(200, file.length());

        OutputStream os = exchange.getResponseBody();
        FileInputStream fs = new FileInputStream(file);
        byte[] buffer = new byte[4096];
        int bytesRead;
        while ((bytesRead = fs.read(buffer)) != -1) {
            os.write(buffer, 0, bytesRead);
        }
        fs.close();
        os.close();
    }
}   