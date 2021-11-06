package com.m2gi.ecom.service;

import com.m2gi.ecom.domain.Recipe;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Recipe}.
 */
public interface RecipeService {
    /**
     * Save a recipe.
     *
     * @param recipe the entity to save.
     * @return the persisted entity.
     */
    Recipe save(Recipe recipe);

    /**
     * Partially updates a recipe.
     *
     * @param recipe the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Recipe> partialUpdate(Recipe recipe);

    /**
     * Get all the recipes.
     *
     * @return the list of entities.
     */
    List<Recipe> findAll();

    /**
     * Get all the recipes with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Recipe> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" recipe.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Recipe> findOne(Long id);

    /**
     * Delete the "id" recipe.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
