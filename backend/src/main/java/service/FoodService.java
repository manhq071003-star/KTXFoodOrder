package service;

import model.Food;
import repository.FoodRepository;

import java.util.List;

public class FoodService {
    private final FoodRepository repository = new FoodRepository();

    public List<Food> getAllFoods() {
        return repository.findAll();
    }

    public void addFood(Food food) {
        repository.save(food);
    }

    public void updateStatus(String id, boolean available) {
        repository.updateStatus(id, available);
    }

    public void updatePrice(String id, double price) {
        repository.updatePrice(id, price);
    }

    public void deleteFood(String id) {
        repository.deleteById(id);
    }

    public String getAllFoodsAsJson() {
        List<Food> foods = getAllFoods();
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < foods.size(); i++) {
            Food f = foods.get(i);
            json.append(String.format("{\"id\":\"%s\",\"name\":\"%s\",\"price\":%.0f,\"imageUrl\":\"%s\",\"available\":%b}",
                    f.getId(), f.getName(), f.getPrice(), f.getImageUrl(), f.isAvailable()));
            if (i < foods.size() - 1) json.append(",");
        }
        json.append("]");
        return json.toString();
    }
}