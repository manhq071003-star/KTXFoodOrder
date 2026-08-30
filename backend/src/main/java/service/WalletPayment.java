package service;

import model.User;

public class WalletPayment implements PaymentMethod {

    @Override
    public PaymentResult pay(
            User user,
            double amount) {

        if (user.getBalance() < amount) {

            return new PaymentResult(
                    PaymentStatus.FAILED,
                    "So du vi khong du.",
                    getMethodName()
            );
        }

        user.setBalance(
                user.getBalance() - amount
        );

        return new PaymentResult(
                PaymentStatus.SUCCESS,
                "Thanh toan bang vi thanh cong.",
                getMethodName()
        );
    }

    @Override
    public String getMethodName() {
        return "WALLET";
    }
}