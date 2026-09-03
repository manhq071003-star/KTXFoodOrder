package service;

import model.Student;

public class CashPayment implements PaymentMethod {
    @Override
    public void processPayment(Student student, double amount) {
        // Thanh toán tiền mặt trực tiếp không trừ tiền ví sinh viên ngay
    }

    @Override
    public String getMethodName() {
        return "Tiền mặt";
    }
}