package service;

public class WalletPayment implements PaymentMethod {
    @Override
    public boolean processPayment(double amount) {
        return true;
    }
}