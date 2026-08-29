package service;

import model.User;

public interface PaymentMethod {

    boolean pay(User user, double amount);

    String getMethodName();
}