package service;

import model.User;

public class BankTransferPayment implements PaymentMethod {

    @Override
    public boolean pay(User user, double amount) {

        try {

            PaymentBusinessRules.validateSufficientBalance(
                    user,
                    amount
            );

            user.setBalance(
                    user.getBalance() - amount
            );

            System.out.println(
                    "Chuyen khoan thanh cong."
            );

            return true;

        } catch (IllegalArgumentException e) {

            System.out.println(
                    "Chuyen khoan that bai: "
                            + e.getMessage()
            );

            return false;
        }
    }

    @Override
    public String getMethodName() {
        return "BANK_TRANSFER";
    }
}