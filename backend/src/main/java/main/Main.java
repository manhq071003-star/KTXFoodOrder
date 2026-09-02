package main;

import com.sun.net.httpserver.HttpServer;
import handler.*;

import java.io.IOException;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws IOException {
        int port = 8080;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/api/foods", new FoodHandler());
        server.createContext("/api/students", new StudentHandler());
        server.createContext("/api/cart", new CartHandler());
        server.createContext("/api/orders", new OrderHandler());
        server.createContext("/api/payments", new PaymentHandler());

        server.setExecutor(null);
        System.out.println(" Backend HttpServer chạy tại cổng http://localhost:" + port);
        server.start();
    }
}