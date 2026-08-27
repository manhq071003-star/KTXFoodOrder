package model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Order {

    private String id;
    private Student student;
    private LocalDateTime orderTime;
    private List<OrderDetail> orderDetails;
    private double totalAmount;
    private String status;

    public Order() {
        this.orderDetails = new ArrayList<>();
    }

    public Order(String id, Student student) {
        this.id = id;
        this.student = student;
        this.orderTime = LocalDateTime.now();
        this.orderDetails = new ArrayList<>();
        this.totalAmount = 0;
        this.status = "Chưa thanh toán";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public LocalDateTime getOrderTime() {
        return orderTime;
    }

    public void setOrderTime(LocalDateTime orderTime) {
        this.orderTime = orderTime;
    }

    public List<OrderDetail> getOrderDetails() {
        return orderDetails;
    }

    public void setOrderDetails(List<OrderDetail> orderDetails) {
        this.orderDetails = orderDetails;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Order{" +
                "id='" + id + '\'' +
                ", student=" +
                (student != null ? student.getName() : "null") +
                ", orderTime=" + orderTime +
                ", orderDetails=" + orderDetails +
                ", totalAmount=" + totalAmount +
                ", status='" + status + '\'' +
                '}';
    }
}