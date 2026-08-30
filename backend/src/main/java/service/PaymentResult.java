package service;

public class PaymentResult {

    private PaymentStatus status;
    private String message;
    private String paymentMethod;

    public PaymentResult(
            PaymentStatus status,
            String message,
            String paymentMethod) {

        this.status = status;
        this.message = message;
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public boolean isSuccess() {
        return status == PaymentStatus.SUCCESS;
    }
}