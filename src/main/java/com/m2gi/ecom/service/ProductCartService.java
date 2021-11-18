package com.m2gi.ecom.service;

import com.m2gi.ecom.domain.ProductCart;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link ProductCart}.
 */
public interface ProductCartService {
    /**
     * Save a productCart.
     *
     * @param productCart the entity to save.
     * @return the persisted entity.
     */
    ProductCart save(ProductCart productCart);

    /**
     * Partially updates a productCart.
     *
     * @param productCart the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ProductCart> partialUpdate(ProductCart productCart);

    ProductCart updateQuantity(Long id, int quantity);

    /**
     * Get all the productCarts.
     *
     * @return the list of entities.
     */
    List<ProductCart> findAll();

    /**
     * Get the "id" productCart.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ProductCart> findOne(Long id);

    /**
     * Delete the "id" productCart.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
