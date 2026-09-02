package service;

import model.Student;

public class CashPayment implements PaymentMethod {
    @Override
    public String getTypeCode() { return "CASH"; }

    @Override
    public String getMethodName() { return "Tiền mặt khi nhận hàng"; }

    @Override
    public void processPayment(Student student, double amount) {
        // Thanh toán tiền mặt tại căng tin - không trừ số dư ví
    }
}