package model;

public class CartItem {
    private Food food;
    private int quantity;

    public CartItem() {}

    public CartItem(Food food, int quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Số lượng món không được nhỏ hơn 1.");
        }
        this.food = food;
        this.quantity = quantity;
    }

    public Food getFood() { return food; }
    public void setFood(Food food) { this.food = food; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Số lượng món không được nhỏ hơn 1.");
        }
        this.quantity = quantity;
    }

    public double getSubtotal() {
        return food.getPrice() * quantity;
    }
}