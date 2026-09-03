package service;

import model.Student;
import utils.CustomExceptions.InsufficientBalanceException;

public class WalletPayment implements PaymentMethod {
    @Override
    public void processPayment(Student student, double amount) {
        if (student.getBalance() < amount) {
            throw new InsufficientBalanceException("Số dư ví không đủ để thanh toán. Số dư hiện tại: " + student.getBalance());
        }
        student.setBalance(student.getBalance() - amount);
    }

    @Override
    public String getMethodName() {
        return "Ví sinh viên";
    }
}