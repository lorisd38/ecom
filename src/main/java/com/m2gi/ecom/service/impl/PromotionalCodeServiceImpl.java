package com.m2gi.ecom.service.impl;

import com.m2gi.ecom.domain.PromotionalCode;
import com.m2gi.ecom.repository.PromotionalCodeRepository;
import com.m2gi.ecom.service.PromotionalCodeService;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link PromotionalCode}.
 */
@Service
@Transactional
public class PromotionalCodeServiceImpl implements PromotionalCodeService {

    private final Logger log = LoggerFactory.getLogger(PromotionalCodeServiceImpl.class);

    private final PromotionalCodeRepository promotionalCodeRepository;

    public PromotionalCodeServiceImpl(PromotionalCodeRepository promotionalCodeRepository) {
        this.promotionalCodeRepository = promotionalCodeRepository;
    }

    @Override
    public PromotionalCode save(PromotionalCode promotionalCode) {
        log.debug("Request to save PromotionalCode : {}", promotionalCode);
        return promotionalCodeRepository.save(promotionalCode);
    }

    @Override
    public Optional<PromotionalCode> partialUpdate(PromotionalCode promotionalCode) {
        log.debug("Request to partially update PromotionalCode : {}", promotionalCode);

        return promotionalCodeRepository
            .findById(promotionalCode.getId())
            .map(existingPromotionalCode -> {
                if (promotionalCode.getCode() != null) {
                    existingPromotionalCode.setCode(promotionalCode.getCode());
                }
                if (promotionalCode.getStartDate() != null) {
                    existingPromotionalCode.setStartDate(promotionalCode.getStartDate());
                }
                if (promotionalCode.getEndDate() != null) {
                    existingPromotionalCode.setEndDate(promotionalCode.getEndDate());
                }
                if (promotionalCode.getValue() != null) {
                    existingPromotionalCode.setValue(promotionalCode.getValue());
                }
                if (promotionalCode.getUnit() != null) {
                    existingPromotionalCode.setUnit(promotionalCode.getUnit());
                }

                return existingPromotionalCode;
            })
            .map(promotionalCodeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromotionalCode> findAll() {
        log.debug("Request to get all PromotionalCodes");
        return promotionalCodeRepository.findAllWithEagerRelationships();
    }

    public Page<PromotionalCode> findAllWithEagerRelationships(Pageable pageable) {
        return promotionalCodeRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PromotionalCode> findOne(Long id) {
        log.debug("Request to get PromotionalCode : {}", id);
        return promotionalCodeRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete PromotionalCode : {}", id);
        promotionalCodeRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PromotionalCode> findAllWithEagerRelationshipsByCode(String code, Instant date) {
        log.debug("Request to get active PromotionalCode with code: {} for date {}", code, date);
        return promotionalCodeRepository.findActiveWithEagerRelationshipsByCode(code, date);
    }
}
