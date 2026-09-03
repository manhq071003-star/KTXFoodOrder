package service;

public class CashPayment implements PaymentMethod {
    @Override
    public boolean processPayment(double amount) {
        // TODO: Xử lý thanh toán tiền mặt
        return false;
    }
}