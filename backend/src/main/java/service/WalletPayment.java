package service;

import model.Student;
import utils.CustomExceptions.InsufficientBalanceException;

public class WalletPayment implements PaymentMethod {
    @Override public String getTypeCode() { return "WALLET"; }
    @Override public String getMethodName() { return "Ví sinh viên KTX"; }
    @Override
    public void processPayment(Student student, double amount) {
        if (student.getBalance() < amount) {
            throw new InsufficientBalanceException("Số dư ví KTX không đủ thanh toán!");
        }
        student.setBalance(student.getBalance() - amount);
    }
}