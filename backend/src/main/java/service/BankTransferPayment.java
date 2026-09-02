package service;

import model.Student;

public class BankTransferPayment implements PaymentMethod {
    @Override
    public String getTypeCode() { return "BANK"; }

    @Override
    public String getMethodName() { return "Chuyển khoản ngân hàng"; }

    @Override
    public void processPayment(Student student, double amount) {
        // Thanh toán qua mã QR chuyển khoản - không trừ số dư ví
    }
}