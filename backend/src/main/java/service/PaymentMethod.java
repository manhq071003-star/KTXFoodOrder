package service;

import model.Student;

public interface PaymentMethod {
    String getTypeCode();
    String getMethodName();
    void processPayment(Student student, double amount);
}