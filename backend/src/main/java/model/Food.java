package model;

public class Food {
    private String id;
    private String name;
    private double price;
    private boolean available;

    public Food() {}

    public Food(String id, String name, double price, boolean available) {
        if (price < 0) {
            throw new IllegalArgumentException("Giá món ăn không được âm.");
        }
        this.id = id;
        this.name = name;
        this.price = price;
        this.available = available;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) {
        if (price < 0) {
            throw new IllegalArgumentException("Giá món ăn không được âm.");
        }
        this.price = price;
    }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}