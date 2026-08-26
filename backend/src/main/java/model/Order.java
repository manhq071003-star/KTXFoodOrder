package model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class Order {
    private String orderId;
    private String studentId;
    private String orderTime;
    private List<OrderDetail> details;
    private double totalAmount;
    private String status;

    public Order(String orderId, String studentId, List<OrderDetail> details, double totalAmount) {
        this.orderId = orderId;
        this.studentId = studentId;
        this.orderTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
        this.details = details;
        this.totalAmount = totalAmount;
        this.status = "Chưa thanh toán";
    }

    public String getOrderId() { return orderId; }
    public String getStudentId() { return studentId; }
    public String getOrderTime() { return orderTime; }
    public List<OrderDetail> getDetails() { return details; }
    public double getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}