package com.m2gi.ecom.service;

import com.m2gi.ecom.domain.Product;
import com.m2gi.ecom.domain.Promotion;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Promotion}.
 */
public interface PromotionService {
    /**
     * Save a promotion.
     *
     * @param promotion the entity to save.
     * @return the persisted entity.
     */
    Promotion save(Promotion promotion);

    /**
     * Partially updates a promotion.
     *
     * @param promotion the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Promotion> partialUpdate(Promotion promotion);

    /**
     * Get all the promotions.
     *
     * @return the list of entities.
     */
    List<Promotion> findAll();

    /**
     * Get all the promotions with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Promotion> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" promotion.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Promotion> findOne(Long id);

    /**
     * Delete the "id" promotion.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Get the list of active promotions at the given instant.
     *
     * @param instant the instant to search with.
     * @return the list of active promotions.
     */
    List<Promotion> findActiveWithEagerRelationships(Instant instant);

    /**
     * Get the list of active promotions for the product at the given instant.
     *
     * @param instant the instant to search with.
     * @param product the concerned product.
     * @return the list of active promotions for the product.
     */
    List<Promotion> findActiveForProduct(Instant instant, Product product);
}
