package handler;

import com.google.gson.Gson;
import model.Order;
import model.OrderDetail;
import service.OrderService;

import java.util.List;

public class OrderHandler {
    private final OrderService orderService = new OrderService();
    private final Gson gson = new Gson();

    public String handleCreateOrder(String studentId, List<OrderDetail> details, double totalAmount) {
        try {
            Order order = orderService.createOrder(studentId, details, totalAmount);
            return gson.toJson(order);
        } catch (Exception e) {
            return String.format("{\"status\": \"ERROR\", \"message\": \"%s\"}", e.getMessage());
        }
    }

    public String handleGetAllOrders() {
        return gson.toJson(orderService.getAllOrders());
    }
}