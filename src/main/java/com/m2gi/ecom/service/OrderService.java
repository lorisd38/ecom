package com.m2gi.ecom.service;

import com.m2gi.ecom.domain.Cart;
import com.m2gi.ecom.domain.Order;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Order}.
 */
public interface OrderService {
    /**
     * Save an order.
     *
     * @param order the entity to save.
     * @return the persisted entity.
     */
    Order save(Order order);

    /**
     * Create an order, empty the cart and changes the products' quantities
     * @param order the order to create.
     * @return the persisted entity.
     */
    Order createOrder(Order order, Cart cart);

    /**
     * Partially updates a order.
     *
     * @param order the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Order> partialUpdate(Order order);

    /**
     * Get all the orders.
     *
     * @return the list of entities.
     */
    List<Order> findAll();

    /**
     * Get all the orders.
     * @param login the user's login
     * @return the list of entities.
     */
    List<Order> findAllByUserLogin(String login);

    /**
     * Get the "id" order.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Order> findOne(Long id);

    /**
     * Delete the "id" order.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
