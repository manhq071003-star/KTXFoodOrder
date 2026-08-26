package model;

public class OrderDetail {
    private String foodName;
    private double price;
    private int quantity;

    public OrderDetail(String foodName, double price, int quantity) {
        this.foodName = foodName;
        this.price = price;
        this.quantity = quantity;
    }

    public String getFoodName() { return foodName; }
    public double getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public double getSubtotal() { return price * quantity; }
}