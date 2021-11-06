package com.m2gi.ecom.service;

import com.m2gi.ecom.domain.ProductOrder;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link ProductOrder}.
 */
public interface ProductOrderService {
    /**
     * Save a productOrder.
     *
     * @param productOrder the entity to save.
     * @return the persisted entity.
     */
    ProductOrder save(ProductOrder productOrder);

    /**
     * Partially updates a productOrder.
     *
     * @param productOrder the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ProductOrder> partialUpdate(ProductOrder productOrder);

    /**
     * Get all the productOrders.
     *
     * @return the list of entities.
     */
    List<ProductOrder> findAll();

    /**
     * Get the "id" productOrder.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ProductOrder> findOne(Long id);

    /**
     * Delete the "id" productOrder.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
