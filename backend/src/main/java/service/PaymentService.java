package service;


import model.User;

public class PaymentService {

    public PaymentResult processPayment(
            User user,
            double amount,
            PaymentMethod paymentMethod) {

        try {

            PaymentBusinessRules.validateUser(user);

            PaymentBusinessRules.validateAmount(amount);

            PaymentBusinessRules.validatePaymentMethod(
                    paymentMethod
            );

            return paymentMethod.pay(user, amount);

        } catch (IllegalArgumentException e) {

            return new PaymentResult(
                    PaymentStatus.FAILED,
                    e.getMessage(),
                    paymentMethod != null
                            ? paymentMethod.getMethodName()
                            : "UNKNOWN"
            );
        }
    }
}