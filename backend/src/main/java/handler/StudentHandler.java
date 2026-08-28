package handler;

import com.google.gson.Gson;
import model.Student;
import service.StudentService;

import java.util.List;

public class StudentHandler {
    private final StudentService studentService = new StudentService();
    private final Gson gson = new Gson();

    public String handleGetAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return gson.toJson(students);
    }

    public String handleGetStudentById(String id) {
        Student student = studentService.getStudentById(id);
        if (student != null) {
            return gson.toJson(student);
        }
        return "{\"error\": \"Student not found\"}";
    }
}