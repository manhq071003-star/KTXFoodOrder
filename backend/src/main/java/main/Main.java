package main;

import com.sun.net.httpserver.HttpServer;
import config.Database;
import handler.*;

import java.awt.Desktop;
import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;

public class Main {
    public static void main(String[] args) throws IOException {
        Database.initDatabase();

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/api/foods", new FoodHandler());
        server.createContext("/api/students", new StudentHandler());
        server.createContext("/api/cart", new CartHandler());
        server.createContext("/api/orders", new OrderHandler());
        server.createContext("/api/payment", new PaymentHandler());

        String frontendDir = "frontend";
        if (!new File(frontendDir).exists()) {
            frontendDir = "../frontend";
        }
        server.createContext("/", new StaticFileHandler(frontendDir));

        server.setExecutor(null);
        server.start();

        String appUrl = "http://localhost:8080/index.html";
        System.out.println("🚀 KTX FoodExpress Server Running at: " + appUrl);

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