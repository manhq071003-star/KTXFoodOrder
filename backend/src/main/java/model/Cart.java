package model;

import java.util.ArrayList;
import java.util.List;

public class Cart {
    private String studentId;
    private List<CartItem> items;

    public Cart() {
        this.items = new ArrayList<>();
    }

    public Cart(String studentId) {
        this.studentId = studentId;
        this.items = new ArrayList<>();
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public void addItem(Food food, int quantity) {
        if (!food.isAvailable()) {
            throw new IllegalArgumentException("Không thể thêm món đã hết hàng.");
        }
        for (CartItem item : items) {
            if (item.getFood().getId().equals(food.getId())) {
                item.setQuantity(item.getQuantity() + quantity);
                return;
            }
        }
        items.add(new CartItem(food, quantity));
    }

    public void updateQuantity(String foodId, int quantity) {
        for (CartItem item : items) {
            if (item.getFood().getId().equals(foodId)) {
                item.setQuantity(quantity);
                return;
            }
        }
    }

    public void removeItem(String foodId) {
        items.removeIf(item -> item.getFood().getId().equals(foodId));
    }

    public void clear() {
        items.clear();
    }

    public double getTotalAmount() {
        return items.stream().mapToDouble(CartItem::getSubtotal).sum();
    }
}