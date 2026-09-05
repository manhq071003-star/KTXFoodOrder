package repository;

import config.Database;
import model.Food;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FoodRepository {

    public List<Food> findAll() {
        List<Food> foods = new ArrayList<>();
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM foods")) {
            while (rs.next()) {
                foods.add(new Food(
                        rs.getString("id"),
                        rs.getString("name"),
                        rs.getDouble("price"),
                        rs.getString("image_url"),
                        rs.getInt("available") == 1
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return foods;
    }

    public void save(Food food) {
        String sql = "INSERT INTO foods (id, name, price, image_url, available) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, food.getId());
            pstmt.setString(2, food.getName());
            pstmt.setDouble(3, food.getPrice());
            pstmt.setString(4, food.getImageUrl());
            pstmt.setInt(5, food.isAvailable() ? 1 : 0);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void updateStatus(String id, boolean available) {
        String sql = "UPDATE foods SET available = ? WHERE id = ?";
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, available ? 1 : 0);
            pstmt.setString(2, id);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void updatePrice(String id, double price) {
        String sql = "UPDATE foods SET price = ? WHERE id = ?";
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setDouble(1, price);
            pstmt.setString(2, id);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deleteById(String id) {
        String sql = "DELETE FROM foods WHERE id = ?";
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, id);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}