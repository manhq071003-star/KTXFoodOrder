package service;

import model.Cart;
import model.Food;

import java.util.HashMap;
import java.util.Map;

public class CartService {
    private final Map<String, Cart> studentCarts = new HashMap<>();

    public Cart getCart(String studentId) {
        return studentCarts.computeIfAbsent(studentId, k -> new Cart());
    }

    public void addToCart(String studentId, Food food, int quantity) {
        getCart(studentId).addItem(food, quantity);
    }

    public void clearCart(String studentId) {
        getCart(studentId).clear();
    }
}