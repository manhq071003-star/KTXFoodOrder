package service;

import model.Student;
import repository.StudentRepository;
import utils.CustomExceptions.NotFoundException;

public class StudentService {
    private final StudentRepository repo = new StudentRepository();

    public Student getStudent(String id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy sinh viên"));
    }

    public void updateStudent(Student student) { repo.update(student); }
}