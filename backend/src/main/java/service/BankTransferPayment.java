package service;

public class BankTransferPayment implements PaymentMethod {
    @Override
    public boolean processPayment(double amount) {
        // TODO: Xử lý thanh toán chuyển khoản QR
        return false;
    }
}