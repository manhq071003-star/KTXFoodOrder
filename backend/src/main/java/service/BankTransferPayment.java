package service;

import model.Student;

public class BankTransferPayment implements PaymentMethod {
    @Override
    public void processPayment(Student student, double amount) {
        // Xử lý logic chuyển khoản ngân hàng (mặc định chấp nhận giao dịch)
    }

    @Override
    public String getMethodName() {
        return "Chuyển khoản ngân hàng";
    }
}