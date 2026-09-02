package utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

public class CodeGenerator {
    public static String generateOrderId() {
        String prefix = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String randomStr = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "ORD-" + prefix + "-" + randomStr;
    }

    public static String getCurrentTimestamp() {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    }
}