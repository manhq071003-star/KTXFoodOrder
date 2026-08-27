package model;

import java.util.List;

public class Order {
    private String id;
    private String studentId;
    private List<OrderDetail> items;
    private double totalAmount;
    private String status;
    private String orderTime;

    public Order() {}

    public Order(String id, String studentId, List<OrderDetail> items, double totalAmount) {
        this.id = id;
        this.studentId = studentId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = "PENDING";
        this.orderTime = java.time.LocalDateTime.now().toString();
    }

    public Order(String id, String studentId, List<OrderDetail> items, double totalAmount, String status, String orderTime) {
        this.id = id;
        this.studentId = studentId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderTime = orderTime;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public List<OrderDetail> getItems() { return items; }
    public void setItems(List<OrderDetail> items) { this.items = items; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOrderTime() { return orderTime; }
    public void setOrderTime(String orderTime) { this.orderTime = orderTime; }
}