package service;

public class CashPayment implements PaymentMethod {
    @Override
    public boolean processPayment(double amount) {
        return true;
    }
}