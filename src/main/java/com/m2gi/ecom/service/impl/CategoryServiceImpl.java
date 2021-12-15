package com.m2gi.ecom.service.impl;

import com.m2gi.ecom.domain.Category;
import com.m2gi.ecom.domain.Product;
import com.m2gi.ecom.repository.CategoryRepository;
import com.m2gi.ecom.repository.ProductRepository;
import com.m2gi.ecom.service.CategoryService;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Category}.
 */
@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final Logger log = LoggerFactory.getLogger(CategoryServiceImpl.class);

    private final CategoryRepository categoryRepository;

    private final ProductRepository productRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Category save(Category category) {
        log.debug("Request to save Category : {}", category);
        Long oldParentId = null;
        Category newParent;
        if (category.getId() != null) {
            final Category oldParent = findOne(category.getId()).orElseThrow().getParent();
            if (oldParent != null) oldParentId = oldParent.getId();
        }
        final Category savedCategory = categoryRepository.save(category);
        newParent = savedCategory.getParent();
        categoryRepository.flush();

        if (oldParentId != null && oldParentId.equals(newParent.getId())) return savedCategory;

        if (oldParentId != null) {
            final List<Product> relatedProducts = productRepository.findAllFromCategory(findOne(oldParentId).orElseThrow(), null);
            for (Product p : relatedProducts) {
                p.setRelatedCategories(Category.buildRelatedCategories(p.getCategory()));
                productRepository.save(p);
            }
        }
        if (newParent != null) {
            final List<Product> relatedProducts = productRepository.findAllFromCategory(newParent, null);
            for (Product p : relatedProducts) {
                p.setRelatedCategories(Category.buildRelatedCategories(p.getCategory()));
                productRepository.save(p);
            }
        }

        return savedCategory;
    }

    @Override
    public Optional<Category> partialUpdate(Category category) {
        log.debug("Request to partially update Category : {}", category);

        return categoryRepository
            .findById(category.getId())
            .map(existingCategory -> {
                if (category.getName() != null) {
                    existingCategory.setName(category.getName());
                }

                return existingCategory;
            })
            .map(categoryRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> findAll() {
        log.debug("Request to get all Categories");
        return categoryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Category> findOne(Long id) {
        log.debug("Request to get Category : {}", id);
        return categoryRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Category : {}", id);
        final List<Product> relatedProducts = productRepository.findAllFromCategory(categoryRepository.findById(id).orElseThrow(), null);
        final List<Product> toUpdate = relatedProducts
            .stream()
            .filter(p -> p.getCategory() != null && p.getCategory().getId().equals(id))
            .collect(Collectors.toList());
        toUpdate.forEach(p -> {
            p.setCategory(null);
            p.setRelatedCategories(Collections.emptySet());
        });
        relatedProducts.removeAll(toUpdate);
        relatedProducts.forEach(product -> product.getRelatedCategories().removeIf(category -> category.getId().equals(id)));
        productRepository.saveAll(toUpdate);
        productRepository.saveAll(relatedProducts);
        final List<Long> relatedProductIds = relatedProducts.stream().map(Product::getId).collect(Collectors.toList());

        categoryRepository.deleteById(id);
        categoryRepository.flush();

        final List<Product> newRelatedProducts = productRepository.findAllById(relatedProductIds);
        for (Product p : newRelatedProducts) {
            p.setRelatedCategories(Category.buildRelatedCategories(p.getCategory()));
            productRepository.save(p);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> findAllWithoutParent() {
        log.debug("Request to get Category without parents");
        List<Category> l = categoryRepository.findAllWithoutParents();
        l.forEach(e -> {
            touch(e);
        });
        return l;
    }

    private void touch(Category c) {
        if (!c.getChildren().isEmpty()) {
            c
                .getChildren()
                .forEach(e -> {
                    touch(e);
                });
        }
    }
}
