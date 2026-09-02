package model;

public class Student extends User {
    private String room;
    private double balance;

    public Student() { super(); }

    public Student(String id, String name, String phone, String room, double balance) {
        super(id, name, phone);
        if (balance < 0) {
            throw new IllegalArgumentException("Số dư không thể âm.");
        }
        this.room = room;
        this.balance = balance;
    }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }
    public double getBalance() { return balance; }
    public void setBalance(double balance) {
        if (balance < 0) {
            throw new IllegalArgumentException("Số dư không thể âm.");
        }
        this.balance = balance;
    }
}