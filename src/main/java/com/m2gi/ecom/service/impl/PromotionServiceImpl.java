package com.m2gi.ecom.service.impl;

import com.m2gi.ecom.domain.Product;
import com.m2gi.ecom.domain.Promotion;
import com.m2gi.ecom.repository.PromotionRepository;
import com.m2gi.ecom.service.PromotionService;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Promotion}.
 */
@Service
@Transactional
public class PromotionServiceImpl implements PromotionService {

    private final Logger log = LoggerFactory.getLogger(PromotionServiceImpl.class);

    private final PromotionRepository promotionRepository;

    public PromotionServiceImpl(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    @Override
    public Promotion save(Promotion promotion) {
        log.debug("Request to save Promotion : {}", promotion);
        return promotionRepository.save(promotion);
    }

    @Override
    public Optional<Promotion> partialUpdate(Promotion promotion) {
        log.debug("Request to partially update Promotion : {}", promotion);

        return promotionRepository
            .findById(promotion.getId())
            .map(existingPromotion -> {
                if (promotion.getStartDate() != null) {
                    existingPromotion.setStartDate(promotion.getStartDate());
                }
                if (promotion.getEndDate() != null) {
                    existingPromotion.setEndDate(promotion.getEndDate());
                }
                if (promotion.getValue() != null) {
                    existingPromotion.setValue(promotion.getValue());
                }
                if (promotion.getUnit() != null) {
                    existingPromotion.setUnit(promotion.getUnit());
                }

                return existingPromotion;
            })
            .map(promotionRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Promotion> findAll() {
        log.debug("Request to get all Promotions");
        return promotionRepository.findAllWithEagerRelationships();
    }

    public Page<Promotion> findAllWithEagerRelationships(Pageable pageable) {
        return promotionRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Promotion> findOne(Long id) {
        log.debug("Request to get Promotion : {}", id);
        return promotionRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Promotion : {}", id);
        promotionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Promotion> findActiveWithEagerRelationships(Instant instant) {
        log.debug("Request to get Promotions active at : {}", instant);
        return promotionRepository.findActiveWithEagerRelationships(instant);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Promotion> findActiveForProduct(Instant instant, Product product) {
        log.debug("Request to get Promotions active at : {}, for Product : {}", instant, product.getId());
        return promotionRepository.findActiveForProduct(instant, product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Promotion> findActiveForProducts(Instant instant, List<Product> products) {
        log.debug(
            "Request to get Promotions active at : {}, for Products : {}",
            instant,
            products.stream().map(Product::getId).collect(Collectors.toSet())
        );
        return promotionRepository.findActiveForProducts(instant, products);
    }
}
