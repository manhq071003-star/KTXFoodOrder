package service;

import model.Cart;
import model.Food;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class CartService {
    private final Map<String, Cart> carts = new ConcurrentHashMap<>();
    private final FoodService foodService = new FoodService();

    public synchronized Cart getCart(String studentId) {
        return carts.computeIfAbsent(studentId, k -> new Cart());
    }

    public synchronized void addToCart(String studentId, String foodId, int q) {
        Food food = foodService.getFoodById(foodId);
        if (food != null && food.isAvailable()) {
            getCart(studentId).addItem(food, q);
        }
    }

    public synchronized void removeFromCart(String studentId, String foodId) {
        getCart(studentId).removeItem(foodId);
    }

    public synchronized void clearCart(String studentId) {
        getCart(studentId).clear();
    }
}