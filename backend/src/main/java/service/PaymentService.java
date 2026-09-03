package service;

import java.util.*;

public class PaymentService {
    private final Map<String, PaymentMethod> methods = new HashMap<>();

    public PaymentService() {
        register(new WalletPayment());
        register(new CashPayment());
        register(new BankTransferPayment());
    }

    private void register(PaymentMethod m) { methods.put(m.getTypeCode().toUpperCase(), m); }

    public PaymentMethod getMethod(String type) {
        PaymentMethod m = methods.get(type.toUpperCase());
        if (m == null) throw new IllegalArgumentException("Phương thức không hợp lệ");
        return m;
    }
}