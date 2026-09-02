package utils;

public class ValidationUtils {
    public static void validatePositiveNumber(double val, String fieldName) {
        if (val < 0) {
            throw new IllegalArgumentException(fieldName + " không được là số âm.");
        }
    }

    public static void validateQuantity(int quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Số lượng phải từ 1 trở lên.");
        }
    }
}