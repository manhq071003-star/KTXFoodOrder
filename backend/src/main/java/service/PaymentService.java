package service;

public class PaymentService {
    public PaymentMethod getPaymentMethod(String typeCode) {
        if (typeCode == null) {
            throw new IllegalArgumentException("Chưa chọn phương thức thanh toán.");
        }
        switch (typeCode.toUpperCase()) {
            case "WALLET":
                return new WalletPayment();
            case "CASH":
                return new CashPayment();
            case "BANK":
                return new BankTransferPayment();
            default:
                throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ: " + typeCode);
        }
    }
}