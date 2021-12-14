package com.m2gi.ecom.service.impl;

import com.m2gi.ecom.domain.ProductCart;
import com.m2gi.ecom.repository.ProductCartRepository;
import com.m2gi.ecom.service.ProductCartService;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ProductCart}.
 */
@Service
@Transactional
public class ProductCartServiceImpl implements ProductCartService {

    private final Logger log = LoggerFactory.getLogger(ProductCartServiceImpl.class);

    private final ProductCartRepository productCartRepository;

    @PersistenceContext
    private EntityManager em;

    public ProductCartServiceImpl(ProductCartRepository productCartRepository) {
        this.productCartRepository = productCartRepository;
    }

    @Override
    public ProductCart save(ProductCart productCart) {
        log.debug("Request to save ProductCart : {}", productCart);
        return productCartRepository.save(productCart);
    }

    @Override
    public Optional<ProductCart> partialUpdate(ProductCart productCart) {
        log.debug("Request to partially update ProductCart : {}", productCart);

        return productCartRepository
            .findById(productCart.getId())
            .map(existingProductCart -> {
                if (productCart.getQuantity() != null) {
                    existingProductCart.setQuantity(productCart.getQuantity());
                }
                if (productCart.getCreationDatetime() != null) {
                    existingProductCart.setCreationDatetime(productCart.getCreationDatetime());
                }

                return existingProductCart;
            })
            .map(productCartRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductCart> findAll() {
        log.debug("Request to get all ProductCarts");
        return productCartRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductCart> findOne(Long id) {
        log.debug("Request to get ProductCart : {}", id);
        return productCartRepository.findById(id);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED)
    public void delete(Long id) {
        log.debug("Request to delete ProductCart : {}", id);
        productCartRepository.deleteWithId(id);
    }

    @Override
    @Transactional
    public ProductCart updateQuantity(Long id, int quantity) {
        log.debug("Request to update ProductCart quantity : {}", id);
        final ProductCart result = productCartRepository.findById(id).get();
        result.setQuantity(quantity);
        return productCartRepository.save(result);
    }

    /**
     * Not bought products should be automatically deleted after 3 days.
     * <p>
     * This is scheduled to get fired everyday, at 01:00 (am).
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void removeNotBoughtProducts() {
        productCartRepository
            .findAllByCreationDatetimeBefore(Instant.now().minus(3, ChronoUnit.DAYS))
            .forEach(productCart -> {
                log.debug("Deleting ProductCart after 3 days: {}", productCart);
                productCartRepository.deleteWithId(productCart.getId());
            });
    }
}
