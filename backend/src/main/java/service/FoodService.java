package service;

import model.Food;
import repository.FoodRepository;
import java.util.List;

public class FoodService {
    private final FoodRepository foodRepository = new FoodRepository();

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public Food getFoodById(String id) {
        return foodRepository.findById(id).orElse(null);
    }

    public void addFood(Food food) {
        foodRepository.save(food);
    }

    public void updateFoodStatus(String id, boolean available) {
        foodRepository.updateStatus(id, available);
    }

    public void updateFoodPrice(String id, double price) {
        foodRepository.updatePrice(id, price);
    }

    public void deleteFood(String id) {
        foodRepository.deleteById(id);
    }

    public String getAllFoodsAsJson() {
        List<Food> foods = getAllFoods();
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < foods.size(); i++) {
            Food f = foods.get(i);
            json.append(String.format(
                    "{\"id\":\"%s\",\"name\":\"%s\",\"price\":%.0f,\"available\":%b,\"imageUrl\":\"%s\"}",
                    f.getId(), escapeJson(f.getName()), f.getPrice(), f.isAvailable(), f.getImageUrl()
            ));
            if (i < foods.size() - 1) json.append(",");
        }
        json.append("]");
        return json.toString();
    }

    private String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\"", "\\\"");
    }
}