package repository;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import model.Order;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class OrderRepository {
    private static final String FILE_PATH = "backend/data/orders.json";
    private final Gson gson = new Gson();

    public List<Order> loadAll() {
        File file = new File(FILE_PATH);
        if (!file.exists()) {
            file = new File("orders.json");
        }
        if (!file.exists()) {
            return new ArrayList<>();
        }

        try (FileReader reader = new FileReader(file)) {
            Type listType = new TypeToken<ArrayList<Order>>() {}.getType();
            List<Order> orders = gson.fromJson(reader, listType);
            return orders != null ? orders : new ArrayList<>();
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<Order> getAllOrders() {
        return loadAll();
    }

    public void saveAll(List<Order> orders) {
        File file = new File(FILE_PATH);
        File parent = file.getParentFile();
        if (parent != null && !parent.exists()) {
            parent.mkdirs();
        }
        try (FileWriter writer = new FileWriter(file)) {
            gson.toJson(orders, writer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void saveOrder(Order order) {
        List<Order> orders = loadAll();
        orders.add(order);
        saveAll(orders);
    }
}