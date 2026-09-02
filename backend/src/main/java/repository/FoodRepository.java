package repository;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import model.Food;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class FoodRepository {
    private static final String FILE_PATH = "backend/data/foods.json";
    private final Gson gson = new Gson();

    public List<Food> findAll() {
        File file = new File(FILE_PATH);
        if (!file.exists()) {
            file = new File("foods.json");
        }
        if (!file.exists()) {
            return new ArrayList<>();
        }

        try (FileReader reader = new FileReader(file)) {
            Type listType = new TypeToken<ArrayList<Food>>(){}.getType();
            List<Food> foods = gson.fromJson(reader, listType);
            return foods != null ? foods : new ArrayList<>();
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public Optional<Food> findById(String id) {
        return findAll().stream()
                .filter(f -> f.getId().equalsIgnoreCase(id))
                .findFirst();
    }
}