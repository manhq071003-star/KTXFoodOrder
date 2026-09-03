package service;

import model.Student;
import utils.CustomExceptions.InsufficientBalanceException;

public class WalletPayment implements PaymentMethod {
    @Override
    public String getTypeCode() { return "WALLET"; }

    @Override
    public String getMethodName() { return "Ví sinh viên"; }

    @Override
    public void processPayment(Student student, double amount) {
        if (student.getBalance() < amount) {
            throw new InsufficientBalanceException(
                    "Số dư ví (" + String.format("%,.0f", student.getBalance()) + " VNĐ) không đủ thanh toán " + String.format("%,.0f", amount) + " VNĐ."
            );
        }
        student.setBalance(student.getBalance() - amount);
    }
}