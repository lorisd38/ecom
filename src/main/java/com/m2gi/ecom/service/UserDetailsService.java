package com.m2gi.ecom.service;

import com.m2gi.ecom.domain.UserDetails;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link UserDetails}.
 */
public interface UserDetailsService {
    /**
     * Save a userDetails.
     *
     * @param userDetails the entity to save.
     * @return the persisted entity.
     */
    UserDetails save(UserDetails userDetails);

    /**
     * Partially updates a userDetails.
     *
     * @param userDetails the entity to update partially.
     * @return the persisted entity.
     */
    Optional<UserDetails> partialUpdate(UserDetails userDetails);

    /**
     * Get all the userDetails.
     *
     * @return the list of entities.
     */
    List<UserDetails> findAll();

    /**
     * Get all the userDetails with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<UserDetails> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" userDetails.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UserDetails> findOne(Long id);

    /**
     * Delete the "id" userDetails.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
