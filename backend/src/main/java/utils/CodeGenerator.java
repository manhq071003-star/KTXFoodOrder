package utils;

import java.util.Random;

public class CodeGenerator {
    public static String generateOTP() {
        return String.format("%04d", new Random().nextInt(10000));
    }

    public static String generateOrderId() {
        return "ORD" + System.currentTimeMillis();
    }
}