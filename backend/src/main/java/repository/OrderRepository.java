package repository;

import com.google.gson.reflect.TypeToken;
import model.Order;
import utils.GsonUtils;

import java.io.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class OrderRepository {
    private final String FILE_PATH = "backend/data/orders.json";

    public List<Order> loadAll() {
        File file = new File(FILE_PATH);
        if (!file.exists()) file = new File("data/orders.json");
        if (!file.exists()) return new ArrayList<>();

        try (Reader reader = new FileReader(file)) {
            Type type = new TypeToken<List<Order>>(){}.getType();
            List<Order> orders = GsonUtils.getGson().fromJson(reader, type);
            return orders != null ? orders : new ArrayList<>();
        } catch (IOException e) {
            return new ArrayList<>();
        }
    }

    public void saveOrder(Order order) {
        List<Order> orders = loadAll();
        orders.add(order);

        File file = new File(FILE_PATH);
        if (!file.getParentFile().exists()) file = new File("data/orders.json");

        try (Writer writer = new FileWriter(file)) {
            GsonUtils.getGson().toJson(orders, writer);
        } catch (IOException e) {
            System.err.println("Lỗi ghi file orders.json: " + e.getMessage());
        }
    }
}