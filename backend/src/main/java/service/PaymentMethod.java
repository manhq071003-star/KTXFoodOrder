package service;

import model.User;

public interface PaymentMethod {

    PaymentResult pay(User user, double amount);

    String getMethodName();
}