ackage service;

import model.Order;
import repository.OrderRepository;

import java.util.List;

public class OrderService {
    private final OrderRepository repository = new OrderRepository();

    public void createOrder(Order order) {
        repository.save(order);
    }

    public List<Order> getAllOrders() {
        return repository.findAll();
    }
}