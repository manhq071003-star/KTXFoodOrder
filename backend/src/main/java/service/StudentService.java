package service;

import model.Student;
import repository.StudentRepository;

public class StudentService {
    private final StudentRepository repository = new StudentRepository();

    public Student getStudent(String id) {
        return repository.findById(id);
    }

    public boolean topUp(String id, double amount) {
        Student s = repository.findById(id);
        if (s != null) {
            repository.updateBalance(id, s.getBalance() + amount);
            return true;
        }
        return false;
    }

    public String getStudentAsJson(String id) {
        Student s = getStudent(id);
        if (s == null) return "{}";
        return String.format("{\"id\":\"%s\",\"name\":\"%s\",\"room\":\"%s\",\"balance\":%.0f}",
                s.getId(), s.getName(), s.getRoom(), s.getBalance());
    }
}