package service;

import model.Student;

public interface PaymentMethod {
    void processPayment(Student student, double amount);
    String getMethodName();
}