package service;

import model.Student;
import utils.CustomExceptions.InsufficientBalanceException;

public class WalletPayment implements PaymentMethod {
    @Override
    public boolean processPayment(Student student, double amount) {
        if (student.getBalance() < amount) {
            throw new InsufficientBalanceException("Số dư ví không đủ để thực hiện thanh toán (" + student.getBalance() + " < " + amount + ")");
        }
        student.setBalance(student.getBalance() - amount);
        return true;
    }

    @Override
    public String getMethodName() {
        return "Ví sinh viên";
    }
}
