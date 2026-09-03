package service;

public class WalletPayment implements PaymentMethod {
    @Override
    public boolean processPayment(double amount) {
        // TODO: Xử lý trừ tiền Ví KTX
        return false;
    }
}