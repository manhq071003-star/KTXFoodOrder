package service;

import model.Cart;
import model.Food;

import java.util.HashMap;
import java.util.Map;

public class CartService {
    private final Map<String, Cart> userCarts = new HashMap<>();
    private final FoodService foodService = new FoodService();

    public Cart getCart(String studentId) {
        return userCarts.computeIfAbsent(studentId, Cart::new);
    }

    public void addToCart(String studentId, String foodId, int quantity) {
        Food food = foodService.getFoodById(foodId);
        Cart cart = getCart(studentId);
        cart.addItem(food, quantity);
    }

    public void updateQuantity(String studentId, String foodId, int quantity) {
        Cart cart = getCart(studentId);
        cart.updateQuantity(foodId, quantity);
    }

    public void removeFromCart(String studentId, String foodId) {
        Cart cart = getCart(studentId);
        cart.removeItem(foodId);
    }
}