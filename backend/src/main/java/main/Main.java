import com.sun.net.httpserver.HttpServer;
import config.Database;
import handler.FoodHandler;
import handler.StudentHandler;
import handler.StaticFileHandler;

import java.awt.Desktop;
import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;

public class Main {
    public static void main(String[] args) throws IOException {
        Database.initDatabase();

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // Đăng ký API
        server.createContext("/api/foods", new FoodHandler());
        server.createContext("/api/students", new StudentHandler());

        // Đăng ký phục vụ File Tĩnh HTML/CSS/JS từ thư mục frontend
        String frontendDir = "frontend";
        if (!new File(frontendDir).exists()) {
            frontendDir = "../frontend"; // Hỗ trợ trường hợp Run từ thư mục con backend
        }
        server.createContext("/", new StaticFileHandler(frontendDir));

        server.setExecutor(null);
        server.start();

        String appUrl = "http://localhost:8080/index.html";
        System.out.println("\n====================================================");
        System.out.println("🚀 KTX FoodExpress Server Running!");
        System.out.println("👉 Web Sinh Viên: " + appUrl);
        System.out.println("👉 Web Admin: http://localhost:8080/admin.html");
        System.out.println("====================================================\n");

        try {
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(appUrl));
            } else {
                Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler " + appUrl);
            }
        } catch (Exception e) {
            System.out.println("Mở trình duyệt thủ công tại: " + appUrl);
        }
    }
}