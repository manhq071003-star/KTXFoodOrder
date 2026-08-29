package service;

import model.User;

public class WalletPayment implements PaymentMethod {

    @Override
    public boolean pay(User user, double amount) {

        try {

            // BR04
            PaymentBusinessRules.validateSufficientBalance(
                    user,
                    amount
            );

            user.setBalance(
                    user.getBalance() - amount
            );

            System.out.println(
                    "Thanh toan bang vi thanh cong."
            );

            return true;

        } catch (IllegalArgumentException e) {

            System.out.println(
                    "Thanh toan bang vi that bai: "
                            + e.getMessage()
            );

            return false;
        }
    }

    @Override
    public String getMethodName() {
        return "WALLET";
    }
}