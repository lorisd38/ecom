package com.m2gi.ecom.service.impl;

import com.m2gi.ecom.domain.Category;
import com.m2gi.ecom.domain.Product;
import com.m2gi.ecom.domain.UserDetails;
import com.m2gi.ecom.repository.ProductRepository;
import com.m2gi.ecom.service.ProductService;
import com.m2gi.ecom.service.UserDetailsService;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import liquibase.pro.packaged.P;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Product}.
 */
@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Product save(Product product) {
        log.debug("Request to save Product : {}", product);
        return productRepository.save(product);
    }

    @Override
    public Optional<Product> partialUpdate(Product product) {
        log.debug("Request to partially update Product : {}", product);

        return productRepository
            .findById(product.getId())
            .map(existingProduct -> {
                if (product.getName() != null) {
                    existingProduct.setName(product.getName());
                }
                if (product.getDescription() != null) {
                    existingProduct.setDescription(product.getDescription());
                }
                if (product.getQuantity() != null) {
                    existingProduct.setQuantity(product.getQuantity());
                }
                if (product.getVersion() != null) {
                    existingProduct.setVersion(product.getVersion());
                }
                if (product.getOrigin() != null) {
                    existingProduct.setOrigin(product.getOrigin());
                }
                if (product.getBrand() != null) {
                    existingProduct.setBrand(product.getBrand());
                }
                if (product.getImagePath() != null) {
                    existingProduct.setImagePath(product.getImagePath());
                }
                if (product.getPrice() != null) {
                    existingProduct.setPrice(product.getPrice());
                }
                if (product.getWeight() != null) {
                    existingProduct.setWeight(product.getWeight());
                }
                if (product.getWeightUnit() != null) {
                    existingProduct.setWeightUnit(product.getWeightUnit());
                }

                return existingProduct;
            })
            .map(productRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> findAll() {
        log.debug("Request to get all Products");
        return productRepository.findAllWithEagerRelationships();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> findResearch(String query, List<Long> tagsId) {
        query = query.toLowerCase();
        log.debug("Request to get Products from query : (" + query + ")");
        return productRepository.findAllFromResearch(query, tagsId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> findCategory(Category cat, List<Long> tagsId) {
        log.debug("Request to get Products from a catgeory : (" + cat + ")");
        return productRepository.findAllFromCategory(cat, tagsId);
    }

    public Page<Product> findAllWithEagerRelationships(Pageable pageable) {
        return productRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Product> findOne(Long id) {
        log.debug("Request to get Product : {}", id);
        return productRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Product : {}", id);
        productRepository.deleteById(id);
    }

    @Override
    public List<Product> findAllFavorite(String login) {
        log.debug("Request to get Favorite products with login: {}", login);
        return productRepository.findFavoriteByLogin(login);
    }
}
