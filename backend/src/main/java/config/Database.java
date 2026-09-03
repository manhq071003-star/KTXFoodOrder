package config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class Database {
    private static final String URL = "jdbc:sqlite:ktx_food_express.db";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL);
    }

    public static void initDatabase() {
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS foods (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    price REAL NOT NULL,
                    image_url TEXT,
                    available INTEGER NOT NULL DEFAULT 1
                );
            """);

            stmt.execute("""
                CREATE TABLE IF NOT EXISTS students (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    room TEXT,
                    balance REAL DEFAULT 0
                );
            """);

            var rs = stmt.executeQuery("SELECT COUNT(*) FROM foods");
            if (rs.next() && rs.getInt(1) == 0) {
                stmt.execute("""
                    INSERT INTO foods (id, name, price, image_url, available) VALUES
                    ('F01', 'Cơm tấm sườn nướng', 30000, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', 1),
                    ('F02', 'Bún bò Huế đặc biệt', 35000, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&q=80', 1),
                    ('F03', 'Mì xào hải sản', 35000, 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&q=80', 0),
                    ('F04', 'Trà sữa thái xanh', 15000, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80', 1),
                    ('F05', 'Bánh mì thịt nướng', 20000, 'https://images.unsplash.com/photo-1626844131082-256783844137?w=500&q=80', 1),
                    ('F10', 'Xôi xéo thập cẩm', 20000, 'https://images.unsplash.com/photo-1600454309261-3dc9b7597637?w=500&q=80', 1),
                    ('F11', 'Xôi gà xé phay', 20000, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80', 1),
                    ('F12', 'Bánh mì chả lụa pate', 20000, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&q=80', 1),
                    ('F13', 'Bánh mì 2 trứng ốp la', 20000, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80', 1),
                    ('F06', 'Bún đậu mắm tôm', 40000, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80', 1),
                    ('F07', 'Phở bò tái lăn', 40000, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&q=80', 1),
                    ('F08', 'Trà đào cam sả', 20000, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80', 1),
                    ('F09', 'Cơm chiên Dương Châu', 30000, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80', 1);
                """);
            }

            var rsStd = stmt.executeQuery("SELECT COUNT(*) FROM students");
            if (rsStd.next() && rsStd.getInt(1) == 0) {
                stmt.execute("""
                    INSERT INTO students (id, name, room, balance) VALUES
                    ('SV001', 'Nguyễn Văn A', 'A101', 250000),
                    ('SV002', 'Trần Thị B', 'B205', 180000);
                """);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}