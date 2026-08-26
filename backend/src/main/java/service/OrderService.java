package service;

import model.Order;
import model.OrderDetail;
import repository.OrderRepository;
import utils.CodeGenerator;
import utils.CustomExceptions.InvalidDataException;

import java.util.List;

public class OrderService {
    private OrderRepository orderRepo = new OrderRepository();

    public Order createOrder(String studentId, List<OrderDetail> details, double totalAmount) throws InvalidDataException {
        if (details == null || details.isEmpty()) {
            throw new InvalidDataException("Lỗi: Giỏ hàng rỗng, không thể tạo đơn hàng!");
        }

        String orderId = CodeGenerator.generateOrderId();
        Order newOrder = new Order(orderId, studentId, details, totalAmount);
        newOrder.setStatus("Đã thanh toán");

        orderRepo.saveOrder(newOrder);
        return newOrder;
    }

    public List<Order> getAllOrders() {
        return orderRepo.loadAll();
    }
}