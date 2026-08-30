package service;

import model.User;

public class CashPayment implements PaymentMethod {

    @Override
    public PaymentResult pay(
            User user,
            double amount) {

        return new PaymentResult(
                PaymentStatus.PENDING,
                "Don hang cho thanh toan bang tien mat.",
                getMethodName()
        );
    }

    @Override
    public String getMethodName() {
        return "CASH";
    }
}