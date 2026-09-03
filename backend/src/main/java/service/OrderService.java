package service;

import model.*;
import repository.OrderRepository;
import utils.CodeGenerator;

import java.util.ArrayList;
import java.util.List;

public class OrderService {
    private final CartService cartService;
    private final StudentService studentService = new StudentService();
    private final PaymentService paymentService = new PaymentService();
    private final OrderRepository orderRepository = new OrderRepository();

    public OrderService(CartService cartService) {
        this.cartService = cartService;
    }

    public synchronized Order createOrder(String studentId, String paymentType, double discountAmount) {
        Cart cart = cartService.getCart(studentId);
        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Giỏ hàng rỗng");
        }

        Student student = studentService.getStudent(studentId);

        // Tính tổng tiền chính xác: Lấy tổng giỏ hàng trừ đi số tiền giảm giá
        double total = Math.max(0, cart.getTotalAmount() - discountAmount);

        // Xử lý thanh toán theo phương thức đã chọn
        PaymentMethod method = paymentService.getMethod(paymentType);
        method.processPayment(student, total);
        studentService.updateStudent(student);

        // Chuyển đổi các món ăn trong giỏ hàng thành chi tiết đơn hàng (OrderDetail)
        List<OrderDetail> details = new ArrayList<>();
        for (CartItem ci : cart.getItems()) {
            details.add(new OrderDetail(
                    ci.getFood().getId(),
                    ci.getFood().getName(),
                    ci.getFood().getPrice(),
                    ci.getQuantity()
            ));
        }

        // Tạo đơn hàng và lưu vào cơ sở dữ liệu JSON
        Order order = new Order(
                CodeGenerator.generateOrderCode(),
                studentId,
                details,
                total,
                method.getMethodName()
        );

        orderRepository.save(order);
        cartService.clearCart(studentId);
        return order;
    }
}