package handler;

import repository.StudentRepository;
import utils.GsonUtils;

public class StudentHandler {
    private StudentRepository studentRepo = new StudentRepository();

    public String handleGetAllStudents() {
        return GsonUtils.getGson().toJson(studentRepo.loadAll());
    }
}