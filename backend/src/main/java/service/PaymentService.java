package service;

import java.util.HashMap;
import java.util.Map;

public class PaymentService {
    private final Map<String, PaymentMethod> methods = new HashMap<>();

    public PaymentService() {
        methods.put("WALLET", new WalletPayment());
        methods.put("CASH", new CashPayment());
        methods.put("BANK", new BankTransferPayment());
    }

    public PaymentMethod getPaymentMethod(String code) {
        PaymentMethod method = methods.get(code.toUpperCase());
        if (method == null) {
            throw new IllegalArgumentException("Hình thức thanh toán không hợp lệ: " + code);
        }
        return method;
    }
}