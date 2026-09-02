package service;

import model.Student;
import repository.StudentRepository;

import java.util.List;

public class StudentService {
    private final StudentRepository studentRepository = new StudentRepository();

    public List<Student> getAllStudents() {
        return studentRepository.getAllStudents();
    }

    public Student getStudentById(String id) {
        return studentRepository.getAllStudents().stream()
                .filter(s -> s.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElse(null);
    }

    public boolean deductBalance(String studentId, double amount) {
        List<Student> students = studentRepository.getAllStudents();
        for (Student s : students) {
            if (s.getId().equalsIgnoreCase(studentId)) {
                if (s.getBalance() >= amount) {
                    s.setBalance(s.getBalance() - amount);
                    studentRepository.saveAll(students);
                    return true;
                }
                return false;
            }
        }
        return false;
    }
}