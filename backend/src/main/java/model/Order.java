package model;

import java.time.LocalDateTime;
import java.util.List;

public class Order {
    private String id;
    private String studentId;
    private List<OrderDetail> details;
    private double totalAmount;
    private String paymentMethod;
    private String createdAt;

    public Order() {}

    public Order(String id, String studentId, List<OrderDetail> details, double totalAmount, String paymentMethod) {
        this.id = id;
        this.studentId = studentId;
        this.details = details;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.createdAt = LocalDateTime.now().toString();
    }

    public String getId() { return id; }
    public String getStudentId() { return studentId; }
    public List<OrderDetail> getDetails() { return details; }
    public double getTotalAmount() { return totalAmount; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getCreatedAt() { return createdAt; }
}