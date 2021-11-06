package com.m2gi.ecom.service.impl;

import com.m2gi.ecom.domain.ProductOrder;
import com.m2gi.ecom.repository.ProductOrderRepository;
import com.m2gi.ecom.service.ProductOrderService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ProductOrder}.
 */
@Service
@Transactional
public class ProductOrderServiceImpl implements ProductOrderService {

    private final Logger log = LoggerFactory.getLogger(ProductOrderServiceImpl.class);

    private final ProductOrderRepository productOrderRepository;

    public ProductOrderServiceImpl(ProductOrderRepository productOrderRepository) {
        this.productOrderRepository = productOrderRepository;
    }

    @Override
    public ProductOrder save(ProductOrder productOrder) {
        log.debug("Request to save ProductOrder : {}", productOrder);
        return productOrderRepository.save(productOrder);
    }

    @Override
    public Optional<ProductOrder> partialUpdate(ProductOrder productOrder) {
        log.debug("Request to partially update ProductOrder : {}", productOrder);

        return productOrderRepository
            .findById(productOrder.getId())
            .map(existingProductOrder -> {
                if (productOrder.getQuantity() != null) {
                    existingProductOrder.setQuantity(productOrder.getQuantity());
                }

                return existingProductOrder;
            })
            .map(productOrderRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductOrder> findAll() {
        log.debug("Request to get all ProductOrders");
        return productOrderRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductOrder> findOne(Long id) {
        log.debug("Request to get ProductOrder : {}", id);
        return productOrderRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ProductOrder : {}", id);
        productOrderRepository.deleteById(id);
    }
}
