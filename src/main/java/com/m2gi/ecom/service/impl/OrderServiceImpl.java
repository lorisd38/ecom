package com.m2gi.ecom.service.impl;

import com.m2gi.ecom.domain.Cart;
import com.m2gi.ecom.domain.Order;
import com.m2gi.ecom.repository.CartRepository;
import com.m2gi.ecom.repository.OrderRepository;
import com.m2gi.ecom.service.OrderService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Order}.
 */
@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    public OrderServiceImpl(OrderRepository orderRepository, CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
    }

    @Override
    public Order save(Order order) {
        log.debug("Request to save Order : {}", order);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order createOrder(Order order, Cart cart) {
        log.debug("Request to create Order : {} corresponding to Cart : {}", order, cart);
        this.cartRepository.empty(cart);
        return this.orderRepository.save(order);
    }

    @Override
    public Optional<Order> partialUpdate(Order order) {
        log.debug("Request to partially update Order : {}", order);

        return orderRepository
            .findById(order.getId())
            .map(existingOrder -> {
                if (order.getPaymentDate() != null) {
                    existingOrder.setPaymentDate(order.getPaymentDate());
                }
                if (order.getReceptionDate() != null) {
                    existingOrder.setReceptionDate(order.getReceptionDate());
                }
                if (order.getTotalPrice() != null) {
                    existingOrder.setTotalPrice(order.getTotalPrice());
                }

                return existingOrder;
            })
            .map(orderRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findAll() {
        log.debug("Request to get all Orders");
        return orderRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Order> findOne(Long id) {
        log.debug("Request to get Order : {}", id);
        return orderRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Order : {}", id);
        orderRepository.deleteById(id);
    }
}
