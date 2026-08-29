package service;

import model.User;

public class PaymentBusinessRules {

    public static void validateUser(User user) {

        if (user == null) {
            throw new IllegalArgumentException(
                    "Nguoi dung khong ton tai."
            );
        }
    }

    public static void validateAmount(double amount) {

        if (amount <= 0) {
            throw new IllegalArgumentException(
                    "So tien thanh toan phai lon hon 0."
            );
        }
    }

    public static void validatePaymentMethod(
            PaymentMethod paymentMethod) {

        if (paymentMethod == null) {
            throw new IllegalArgumentException(
                    "Phuong thuc thanh toan khong hop le."
            );
        }
    }

    public static void validateSufficientBalance(
            User user,
            double amount) {

        if (user.getBalance() < amount) {
            throw new IllegalArgumentException(
                    "So du tai khoan khong du."
            );
        }
    }
}