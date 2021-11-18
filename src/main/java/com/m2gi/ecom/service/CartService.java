package com.m2gi.ecom.service;

import com.m2gi.ecom.domain.Cart;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Cart}.
 */
public interface CartService {
    /**
     * Save a cart.
     *
     * @param cart the entity to save.
     * @return the persisted entity.
     */
    Cart save(Cart cart);

    /**
     * Partially updates a cart.
     *
     * @param cart the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Cart> partialUpdate(Cart cart);

    /**
     * Get all the carts.
     *
     * @return the list of entities.
     */
    List<Cart> findAll();
    /**
     * Get all the Cart where User is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<Cart> findAllWhereUserIsNull();

    /**
     * Get the "id" cart.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Cart> findOne(Long id);

    /**
     * Delete the "id" cart.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
    /*
    Optional<Integer> getPrice(long id);
     */
}
