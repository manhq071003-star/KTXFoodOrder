package handler;

import repository.FoodRepository;
import utils.GsonUtils;

public class FoodHandler {
    private FoodRepository foodRepo = new FoodRepository();

    public String handleGetAllFoods() {
        return GsonUtils.getGson().toJson(foodRepo.loadAll());
    }
}