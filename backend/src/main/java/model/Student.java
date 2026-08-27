package model;

public class Student extends User {

    private String dormitoryAddress;
    private double balance;

    public Student() {
        super();
    }

    public Student(String id, String fullName, String phone,
                   String dormitoryAddress, double balance) {

        super(id, fullName, phone);

        this.dormitoryAddress = dormitoryAddress;
        this.balance = balance;
    }

    public String getDormitoryAddress() {
        return dormitoryAddress;
    }

    public void setDormitoryAddress(String dormitoryAddress) {
        this.dormitoryAddress = dormitoryAddress;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    @Override
    public String toString() {
        return "Student{" +
                "id='" + getId() + '\'' +
                ", fullName='" + getFullName() + '\'' +
                ", phone='" + getPhone() + '\'' +
                ", dormitoryAddress='" + dormitoryAddress + '\'' +
                ", balance=" + balance +
                '}';
    }
}