package repository;

import com.google.gson.reflect.TypeToken;
import model.Student;
import utils.GsonUtils;

import java.io.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class StudentRepository {
    private final String filePath = "data/students.json";

    public synchronized List<Student> findAll() {
        File file = new File(filePath);
        if (!file.exists()) return new ArrayList<>();
        try (Reader reader = new FileReader(file)) {
            Type type = new TypeToken<List<Student>>() {}.getType();
            List<Student> students = GsonUtils.getGson().fromJson(reader, type);
            return students != null ? students : new ArrayList<>();
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public synchronized Optional<Student> findById(String id) {
        return findAll().stream().filter(s -> s.getId().equalsIgnoreCase(id)).findFirst();
    }

    public synchronized void update(Student updatedStudent) {
        List<Student> students = findAll();
        for (int i = 0; i < students.size(); i++) {
            if (students.get(i).getId().equalsIgnoreCase(updatedStudent.getId())) {
                students.set(i, updatedStudent);
                break;
            }
        }
        saveAll(students);
    }

    public synchronized void saveAll(List<Student> students) {
        try (Writer writer = new FileWriter(filePath)) {
            GsonUtils.getGson().toJson(students, writer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}