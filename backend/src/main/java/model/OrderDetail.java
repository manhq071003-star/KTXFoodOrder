package model;

public class OrderDetail {
    private String foodName;
    private double price;
    private int quantity;
    private double subtotal;

    public OrderDetail() {}

    public OrderDetail(String foodName, double price, int quantity) {
        this.foodName = foodName;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = price * quantity;
    }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
}