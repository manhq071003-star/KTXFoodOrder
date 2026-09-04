package model;

import java.util.List;

public class Order {
    private String orderId;
    private String studentId;
    private List<OrderDetail> details;
    private double totalAmount;
    private String status;

    public Order() {}

    public Order(String orderId, String studentId, List<OrderDetail> details, double totalAmount, String status) {
        this.orderId = orderId;
        this.studentId = studentId;
        this.details = details;
        this.totalAmount = totalAmount;
        this.status = status;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public List<OrderDetail> getDetails() { return details; }
    public void setDetails(List<OrderDetail> details) { this.details = details; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}