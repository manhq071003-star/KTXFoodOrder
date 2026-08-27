package service;

import model.Order;
import model.OrderDetail;
import repository.OrderRepository;

import java.util.List;
import java.util.stream.Collectors;

public class OrderService {
    private final OrderRepository orderRepository = new OrderRepository();

    public List<Order> getAllOrders() {
        return orderRepository.loadAll();
    }

    public List<Order> getOrdersByStudentId(String studentId) {
        return orderRepository.loadAll().stream()
                .filter(o -> o.getStudentId().equalsIgnoreCase(studentId))
                .collect(Collectors.toList());
    }

    // Tự động sinh ID đơn hàng và trả về Order vừa tạo
    public Order createOrder(String studentId, List<OrderDetail> items, double totalAmount) {
        String id = "ORD" + System.currentTimeMillis();
        Order newOrder = new Order(id, studentId, items, totalAmount);
        orderRepository.saveOrder(newOrder);
        return newOrder;
    }
}