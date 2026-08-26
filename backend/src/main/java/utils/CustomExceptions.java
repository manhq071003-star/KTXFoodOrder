package utils;

public class CustomExceptions {
    public static class OutOfStockException extends Exception {
        public OutOfStockException(String message) { super(message); }
    }
    public static class InsufficientBalanceException extends Exception {
        public InsufficientBalanceException(String message) { super(message); }
    }
    public static class InvalidDataException extends Exception {
        public InvalidDataException(String message) { super(message); }
    }
}