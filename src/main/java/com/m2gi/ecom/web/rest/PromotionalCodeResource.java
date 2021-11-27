package com.m2gi.ecom.web.rest;

import com.m2gi.ecom.domain.PromotionalCode;
import com.m2gi.ecom.repository.PromotionalCodeRepository;
import com.m2gi.ecom.service.PromotionalCodeService;
import com.m2gi.ecom.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.m2gi.ecom.domain.PromotionalCode}.
 */
@RestController
@RequestMapping("/api")
public class PromotionalCodeResource {

    private final Logger log = LoggerFactory.getLogger(PromotionalCodeResource.class);

    private static final String ENTITY_NAME = "promotionalCode";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PromotionalCodeService promotionalCodeService;

    private final PromotionalCodeRepository promotionalCodeRepository;

    public PromotionalCodeResource(PromotionalCodeService promotionalCodeService, PromotionalCodeRepository promotionalCodeRepository) {
        this.promotionalCodeService = promotionalCodeService;
        this.promotionalCodeRepository = promotionalCodeRepository;
    }

    /**
     * {@code POST  /promotional-codes} : Create a new promotionalCode.
     *
     * @param promotionalCode the promotionalCode to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new promotionalCode, or with status {@code 400 (Bad Request)} if the promotionalCode has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/promotional-codes")
    public ResponseEntity<PromotionalCode> createPromotionalCode(@Valid @RequestBody PromotionalCode promotionalCode)
        throws URISyntaxException {
        log.debug("REST request to save PromotionalCode : {}", promotionalCode);
        if (promotionalCode.getId() != null) {
            throw new BadRequestAlertException("A new promotionalCode cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PromotionalCode result = promotionalCodeService.save(promotionalCode);
        return ResponseEntity
            .created(new URI("/api/promotional-codes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /promotional-codes/:id} : Updates an existing promotionalCode.
     *
     * @param id the id of the promotionalCode to save.
     * @param promotionalCode the promotionalCode to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated promotionalCode,
     * or with status {@code 400 (Bad Request)} if the promotionalCode is not valid,
     * or with status {@code 500 (Internal Server Error)} if the promotionalCode couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/promotional-codes/{id}")
    public ResponseEntity<PromotionalCode> updatePromotionalCode(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PromotionalCode promotionalCode
    ) throws URISyntaxException {
        log.debug("REST request to update PromotionalCode : {}, {}", id, promotionalCode);
        if (promotionalCode.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, promotionalCode.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!promotionalCodeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PromotionalCode result = promotionalCodeService.save(promotionalCode);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, promotionalCode.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /promotional-codes/:id} : Partial updates given fields of an existing promotionalCode, field will ignore if it is null
     *
     * @param id the id of the promotionalCode to save.
     * @param promotionalCode the promotionalCode to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated promotionalCode,
     * or with status {@code 400 (Bad Request)} if the promotionalCode is not valid,
     * or with status {@code 404 (Not Found)} if the promotionalCode is not found,
     * or with status {@code 500 (Internal Server Error)} if the promotionalCode couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/promotional-codes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PromotionalCode> partialUpdatePromotionalCode(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PromotionalCode promotionalCode
    ) throws URISyntaxException {
        log.debug("REST request to partial update PromotionalCode partially : {}, {}", id, promotionalCode);
        if (promotionalCode.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, promotionalCode.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!promotionalCodeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PromotionalCode> result = promotionalCodeService.partialUpdate(promotionalCode);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, promotionalCode.getId().toString())
        );
    }

    /**
     * {@code GET  /promotional-codes} : get all the promotionalCodes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of promotionalCodes in body.
     */
    @GetMapping("/promotional-codes")
    public List<PromotionalCode> getAllPromotionalCodes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all PromotionalCodes");
        return promotionalCodeService.findAll();
    }

    /**
     * {@code GET  /promotional-codes/:id} : get the "id" promotionalCode.
     *
     * @param id the id of the promotionalCode to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the promotionalCode, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/promotional-codes/{id}")
    public ResponseEntity<PromotionalCode> getPromotionalCode(@PathVariable Long id) {
        log.debug("REST request to get PromotionalCode : {}", id);
        Optional<PromotionalCode> promotionalCode = promotionalCodeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(promotionalCode);
    }

    /**
     * {@code DELETE  /promotional-codes/:id} : delete the "id" promotionalCode.
     *
     * @param id the id of the promotionalCode to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/promotional-codes/{id}")
    public ResponseEntity<Void> deletePromotionalCode(@PathVariable Long id) {
        log.debug("REST request to delete PromotionalCode : {}", id);
        promotionalCodeService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
