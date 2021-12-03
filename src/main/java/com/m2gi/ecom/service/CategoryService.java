package com.m2gi.ecom.service;

import com.m2gi.ecom.domain.Category;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Category}.
 */
public interface CategoryService {
    /**
     * Save a category.
     *
     * @param category the entity to save.
     * @return the persisted entity.
     */
    Category save(Category category);

    /**
     * Partially updates a category.
     *
     * @param category the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Category> partialUpdate(Category category);

    /**
     * Get all the categories.
     *
     * @return the list of entities.
     */
    List<Category> findAll();

    /**
     * Get the "id" category.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Category> findOne(Long id);

    /**
     * Delete the "id" category.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * find all the category which don't have parents
     * @return list of category
     */
    List<Category> findAllWithoutParent();
}
