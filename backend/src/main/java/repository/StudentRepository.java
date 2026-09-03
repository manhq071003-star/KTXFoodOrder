package repository;

import com.google.gson.reflect.TypeToken;
import model.Student;
import utils.GsonUtils;

import java.io.*;
import java.lang.reflect.Type;
import java.util.*;

public class StudentRepository {
    private File getFile() {
        File f = new File("backend/data/students.json");
        if (f.exists()) return f;
        f = new File("data/students.json");
        if (f.exists()) return f;
        return new File("students.json");
    }

    public synchronized List<Student> findAll() {
        File f = getFile();
        if (!f.exists()) return new ArrayList<>();
        try (FileReader r = new FileReader(f)) {
            Type type = new TypeToken<ArrayList<Student>>(){}.getType();
            List<Student> list = GsonUtils.getGson().fromJson(r, type);
            return list != null ? list : new ArrayList<>();
        } catch (IOException e) { return new ArrayList<>(); }
    }

    public synchronized Optional<Student> findById(String id) {
        return findAll().stream().filter(s -> s.getId().equalsIgnoreCase(id)).findFirst();
    }

    public synchronized void update(Student student) {
        List<Student> list = findAll();
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getId().equalsIgnoreCase(student.getId())) {
                list.set(i, student);
                break;
            }
        }
        try (FileWriter w = new FileWriter(getFile())) {
            GsonUtils.getGson().toJson(list, w);
        } catch (IOException e) { e.printStackTrace(); }
    }
}