package model;

public class Student {
    private String id;
    private String name;
    private String room;
    private double balance;

    public Student() {}

    public Student(String id, String name, String room, double balance) {
        this.id = id;
        this.name = name;
        this.room = room;
        this.balance = balance;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }
}