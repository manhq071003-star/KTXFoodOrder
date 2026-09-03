package repository;

import com.google.gson.reflect.TypeToken;
import model.Order;
import utils.GsonUtils;

import java.io.*;
import java.lang.reflect.Type;
import java.util.*;

public class OrderRepository {
    private File getFile() {
        File f = new File("backend/data/orders.json");
        return f.exists() ? f : new File("data/orders.json");
    }

    public synchronized List<Order> findAll() {
        File f = getFile();
        if (!f.exists()) return new ArrayList<>();
        try (FileReader r = new FileReader(f)) {
            Type type = new TypeToken<ArrayList<Order>>(){}.getType();
            List<Order> list = GsonUtils.getGson().fromJson(r, type);
            return list != null ? list : new ArrayList<>();
        } catch (IOException e) { return new ArrayList<>(); }
    }

    public synchronized void save(Order order) {
        List<Order> list = findAll();
        list.add(order);
        try (FileWriter w = new FileWriter(getFile())) {
            GsonUtils.getGson().toJson(list, w);
        } catch (IOException e) { e.printStackTrace(); }
    }
}