package utils;

import java.util.UUID;

public class CodeGenerator {
    public static String generateOrderCode() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}