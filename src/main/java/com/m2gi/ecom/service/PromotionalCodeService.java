package com.m2gi.ecom.service;

import com.m2gi.ecom.domain.PromotionalCode;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

/**
 * Service Interface for managing {@link PromotionalCode}.
 */
public interface PromotionalCodeService {
    /**
     * Save a promotionalCode.
     *
     * @param promotionalCode the entity to save.
     * @return the persisted entity.
     */
    PromotionalCode save(PromotionalCode promotionalCode);

    /**
     * Partially updates a promotionalCode.
     *
     * @param promotionalCode the entity to update partially.
     * @return the persisted entity.
     */
    Optional<PromotionalCode> partialUpdate(PromotionalCode promotionalCode);

    /**
     * Get all the promotionalCodes.
     *
     * @return the list of entities.
     */
    List<PromotionalCode> findAll();

    /**
     * Get all the promotionalCodes with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<PromotionalCode> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" promotionalCode.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PromotionalCode> findOne(Long id);

    /**
     * Delete the "id" promotionalCode.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    Optional<PromotionalCode> findAllWithEagerRelationshipsByCode(String code, Instant date);
}
