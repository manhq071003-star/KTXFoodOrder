package service;

import model.Student;

public class CashPayment implements PaymentMethod {
    @Override
    public boolean processPayment(Student student, double amount) {
        return true;
    }

    @Override
    public String getMethodName() {
        return "Tiền mặt";
    }
}
