package model;

public class OrderDetail {

    private Food food;
    private int quantity;
    private double unitPrice;

    public OrderDetail() {
    }

    public OrderDetail(Food food, int quantity, double unitPrice) {
        this.food = food;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public Food getFood() {
        return food;
    }

    public void setFood(Food food) {
        this.food = food;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public double getTotalPrice() {
        return unitPrice * quantity;
    }

    @Override
    public String toString() {
        return "OrderDetail{" +
                "food=" + (food != null ? food.getName() : "null") +
                ", quantity=" + quantity +
                ", unitPrice=" + unitPrice +
                ", totalPrice=" + getTotalPrice() +
                '}';
    }
}