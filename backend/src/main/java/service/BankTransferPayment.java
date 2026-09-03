package service;

import model.Student;

public class BankTransferPayment implements PaymentMethod {
    @Override public String getTypeCode() { return "BANK"; }
    @Override public String getMethodName() { return "Chuyển khoản QR Bank"; }
    @Override public void processPayment(Student student, double amount) {}
}