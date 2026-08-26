package utils;

public class CodeGenerator {
    private static int orderCounter = 1000;

    public static synchronized String generateOrderId() {
        return "ORD" + (++orderCounter);
    }
}