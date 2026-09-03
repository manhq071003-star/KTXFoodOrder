package model;

public class OrderDetail {
    private String foodId;
    private String foodName;
    private double unitPrice;
    private int quantity;

    public OrderDetail() {}

    public OrderDetail(String foodId, String foodName, double unitPrice, int quantity) {
        this.foodId = foodId;
        this.foodName = foodName;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }

    public String getFoodId() { return foodId; }
    public String getFoodName() { return foodName; }
    public double getUnitPrice() { return unitPrice; }
    public int getQuantity() { return quantity; }
    public double getSubtotal() { return unitPrice * quantity; }
}