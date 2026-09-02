package service;

import model.Student;
import repository.StudentRepository;
import utils.CustomExceptions.ResourceNotFoundException;

public class StudentService {
    private final StudentRepository studentRepository = new StudentRepository();

    public Student getStudent(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên mã: " + id));
    }

    public void updateStudent(Student student) {
        studentRepository.update(student);
    }
}