package utils;

public class ValidationUtils {
    public static boolean isValidStudentId(String id) {
        return id != null && id.matches("^SV\\d{3}$");
    }
}