package service;

import java.util.HashMap;
import java.util.Map;

public class PaymentService {
    private final Map<String, PaymentMethod> methods = new HashMap<>();

    public PaymentService() {
        registerMethod(new WalletPayment());
        registerMethod(new CashPayment());
        registerMethod(new BankTransferPayment());
    }

    private void registerMethod(PaymentMethod method) {
        methods.put(method.getTypeCode().toUpperCase(), method);
    }

    public PaymentMethod getPaymentMethod(String typeCode) {
        PaymentMethod method = methods.get(typeCode.toUpperCase());
        if (method == null) {
            throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ: " + typeCode);
        }
        return method;
    }
}