package service;

import model.*;
import repository.OrderRepository;
import utils.CodeGenerator;
import utils.CustomExceptions.EmptyCartException;

import java.util.ArrayList;
import java.util.List;

public class OrderService {
    private final OrderRepository orderRepository = new OrderRepository();
    private final StudentService studentService = new StudentService();
    private final CartService cartService = new CartService();
    private final PaymentService paymentService = new PaymentService();

    public Order checkout(String studentId, String paymentTypeCode) {
        Cart cart = cartService.getCart(studentId);
        if (cart.getItems().isEmpty()) {
            throw new EmptyCartException("Không thể đặt hàng khi giỏ hàng rỗng.");
        }

        Student student = studentService.getStudent(studentId);
        PaymentMethod paymentMethod = paymentService.getPaymentMethod(paymentTypeCode);

        double total = cart.getTotalAmount();

        paymentMethod.processPayment(student, total);

        List<OrderDetail> details = new ArrayList<>();
        for (CartItem item : cart.getItems()) {
            details.add(new OrderDetail(item.getFood().getName(), item.getFood().getPrice(), item.getQuantity()));
        }

        Order order = new Order(
                CodeGenerator.generateOrderId(),
                studentId,
                CodeGenerator.getCurrentTimestamp(),
                details,
                total,
                paymentMethod.getMethodName(),
                "Đã thanh toán"
        );

        studentService.updateStudent(student);
        orderRepository.saveOrder(order);
        cart.clear();

        return order;
    }

    public List<Order> getAllOrders() {
        return orderRepository.getAllOrders();
    }
}