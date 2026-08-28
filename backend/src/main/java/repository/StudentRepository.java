package repository;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import model.Student;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class StudentRepository {
    private static final String FILE_PATH = "backend/data/students.json";
    private final Gson gson = new Gson();

    public List<Student> getAllStudents() {
        File file = new File(FILE_PATH);
        if (!file.exists()) {
            file = new File("students.json");
        }
        if (!file.exists()) {
            return new ArrayList<>();
        }

        try (FileReader reader = new FileReader(file)) {
            Type listType = new TypeToken<ArrayList<Student>>() {}.getType();
            List<Student> students = gson.fromJson(reader, listType);
            return students != null ? students : new ArrayList<>();
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public Student getStudentById(String id) {
        return getAllStudents().stream()
                .filter(s -> s.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElse(null);
    }

    public void saveAll(List<Student> students) {
        File file = new File(FILE_PATH);
        File parent = file.getParentFile();
        if (parent != null && !parent.exists()) {
            parent.mkdirs();
        }
        try (FileWriter writer = new FileWriter(file)) {
            gson.toJson(students, writer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}