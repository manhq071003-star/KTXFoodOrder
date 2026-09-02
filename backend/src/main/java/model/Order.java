package model;

import java.util.List;

public class Order {
    private String orderId;
    private String studentId;
    private String orderTime;
    private List<OrderDetail> details;
    private double totalAmount;
    private String paymentMethod;
    private String status;

    public Order() {}

    public Order(String orderId, String studentId, String orderTime, List<OrderDetail> details, double totalAmount, String paymentMethod, String status) {
        this.orderId = orderId;
        this.studentId = studentId;
        this.orderTime = orderTime;
        this.details = details;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.status = status;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getOrderTime() { return orderTime; }
    public void setOrderTime(String orderTime) { this.orderTime = orderTime; }
    public List<OrderDetail> getDetails() { return details; }
    public void setDetails(List<OrderDetail> details) { this.details = details; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}