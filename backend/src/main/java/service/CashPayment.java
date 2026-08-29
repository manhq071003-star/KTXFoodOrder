package service;

import model.User;

public class CashPayment implements PaymentMethod {

    @Override
    public boolean pay(User user, double amount) {

        System.out.println(
                "Da chon thanh toan bang tien mat."
        );

        System.out.println(
                "Vui long thanh toan khi nhan don."
        );

        return true;
    }

    @Override
    public String getMethodName() {
        return "CASH";
    }
}