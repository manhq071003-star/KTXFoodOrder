package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;

public class StaticFileHandler implements HttpHandler {
    public StaticFileHandler(String frontendPath) {}

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // TODO: Đọc và trả về file tĩnh HTML, CSS, JS
    }
}