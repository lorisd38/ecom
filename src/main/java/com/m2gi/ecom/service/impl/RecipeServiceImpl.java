package com.m2gi.ecom.service.impl;

import com.m2gi.ecom.domain.Recipe;
import com.m2gi.ecom.repository.RecipeRepository;
import com.m2gi.ecom.service.RecipeService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Recipe}.
 */
@Service
@Transactional
public class RecipeServiceImpl implements RecipeService {

    private final Logger log = LoggerFactory.getLogger(RecipeServiceImpl.class);

    private final RecipeRepository recipeRepository;

    public RecipeServiceImpl(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @Override
    public Recipe save(Recipe recipe) {
        log.debug("Request to save Recipe : {}", recipe);
        return recipeRepository.save(recipe);
    }

    @Override
    public Optional<Recipe> partialUpdate(Recipe recipe) {
        log.debug("Request to partially update Recipe : {}", recipe);

        return recipeRepository
            .findById(recipe.getId())
            .map(existingRecipe -> {
                if (recipe.getName() != null) {
                    existingRecipe.setName(recipe.getName());
                }
                if (recipe.getDescription() != null) {
                    existingRecipe.setDescription(recipe.getDescription());
                }
                if (recipe.getSteps() != null) {
                    existingRecipe.setSteps(recipe.getSteps());
                }
                if (recipe.getImagePath() != null) {
                    existingRecipe.setImagePath(recipe.getImagePath());
                }

                return existingRecipe;
            })
            .map(recipeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Recipe> findAll() {
        log.debug("Request to get all Recipes");
        return recipeRepository.findAllWithEagerRelationships();
    }

    public Page<Recipe> findAllWithEagerRelationships(Pageable pageable) {
        return recipeRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Recipe> findOne(Long id) {
        log.debug("Request to get Recipe : {}", id);
        return recipeRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Recipe : {}", id);
        recipeRepository.deleteById(id);
    }
}
