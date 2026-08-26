package handler;

import model.Order;
import model.OrderDetail;
import service.OrderService;
import utils.GsonUtils;

import java.util.List;

public class OrderHandler {
    private OrderService orderService = new OrderService();

    public String handleCreateOrder(String studentId, List<OrderDetail> details, double totalAmount) {
        try {
            Order order = orderService.createOrder(studentId, details, totalAmount);
            return GsonUtils.getGson().toJson(order);
        } catch (Exception e) {
            return String.format("{\"status\": \"ERROR\", \"message\": \"%s\"}", e.getMessage());
        }
    }

    public String handleGetAllOrders() {
        return GsonUtils.getGson().toJson(orderService.getAllOrders());
    }
}