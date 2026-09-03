package service;

public interface PaymentMethod {
    boolean processPayment(double amount);
}