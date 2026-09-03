package service;

public class PaymentService {
    public boolean executePayment(PaymentMethod method, double amount) {
        return method.processPayment(amount);
    }
}