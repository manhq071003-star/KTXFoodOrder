package service;

import model.Student;

public interface PaymentMethod {
    boolean processPayment(Student student, double amount);
    String getMethodName();
}