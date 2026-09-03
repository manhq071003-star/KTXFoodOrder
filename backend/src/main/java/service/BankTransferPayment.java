package service;

public class BankTransferPayment implements PaymentMethod {
    @Override
    public boolean processPayment(double amount) {
        return true;
    }
}