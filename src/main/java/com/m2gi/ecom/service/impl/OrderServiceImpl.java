package com.m2gi.ecom.service.impl;

import com.m2gi.ecom.domain.Cart;
import com.m2gi.ecom.domain.Order;
import com.m2gi.ecom.domain.Product;
import com.m2gi.ecom.domain.ProductOrder;
import com.m2gi.ecom.repository.CartRepository;
import com.m2gi.ecom.repository.OrderRepository;
import com.m2gi.ecom.repository.ProductRepository;
import com.m2gi.ecom.service.OrderService;
import com.m2gi.ecom.service.errors.InsufficientQuantityException;
import com.m2gi.ecom.service.errors.VersionConflictException;
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
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository, CartRepository cartRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
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
        for (ProductOrder line : order.getLines()) {
            //Try to save until success or the quantity becomes insufficient.
            boolean saved = false;
            while (!saved) {
                try {
                    saveLineAndUpdateProductQuantity(line);
                    saved = true;
                } catch (VersionConflictException ignored) {}
            }
        }
        this.cartRepository.empty(cart);
        return this.orderRepository.save(order);
    }

    private void saveLineAndUpdateProductQuantity(ProductOrder line) {
        final Product original = productRepository.findById(line.getProduct().getId()).orElseThrow();
        final int newQuantity = original.getQuantity() - line.getQuantity();

        if (newQuantity < 0) {
            throw new InsufficientQuantityException();
        }

        original.setQuantity(newQuantity);
        final Product updated = productRepository.save(original);
        if (updated.getVersion().equals(original.getVersion() + 1)) {
            throw new VersionConflictException();
        }
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
