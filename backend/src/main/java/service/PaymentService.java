package service;

import model.User;

public class PaymentService {

    public boolean processPayment(
            User user,
            double amount,
            PaymentMethod paymentMethod) {

        try {

            // BR01
            PaymentBusinessRules.validateUser(user);

            // BR02
            PaymentBusinessRules.validatePaymentMethod(
                    paymentMethod
            );

            // BR03
            PaymentBusinessRules.validateAmount(amount);

            // Thực hiện thanh toán
            return paymentMethod.pay(user, amount);

        } catch (IllegalArgumentException e) {

            System.out.println(
                    "Thanh toan that bai: "
                            + e.getMessage()
            );

            return false;
        }
    }
}