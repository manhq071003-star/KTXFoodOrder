package service;

import model.Food;
import repository.FoodRepository;

import java.util.List;
import java.util.stream.Collectors;

public class FoodService {
    private final FoodRepository foodRepository = new FoodRepository();

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public List<Food> searchByName(String keyword) {
        return foodRepository.findAll().stream()
                .filter(f -> f.getName().toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
    }

    public Food getFoodById(String id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy món ăn mã: " + id));
    }
}