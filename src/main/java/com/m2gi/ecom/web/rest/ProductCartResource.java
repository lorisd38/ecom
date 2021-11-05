package com.m2gi.ecom.web.rest;

import com.m2gi.ecom.domain.ProductCart;
import com.m2gi.ecom.repository.ProductCartRepository;
import com.m2gi.ecom.service.ProductCartService;
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
 * REST controller for managing {@link com.m2gi.ecom.domain.ProductCart}.
 */
@RestController
@RequestMapping("/api")
public class ProductCartResource {

    private final Logger log = LoggerFactory.getLogger(ProductCartResource.class);

    private static final String ENTITY_NAME = "productCart";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductCartService productCartService;

    private final ProductCartRepository productCartRepository;

    public ProductCartResource(ProductCartService productCartService, ProductCartRepository productCartRepository) {
        this.productCartService = productCartService;
        this.productCartRepository = productCartRepository;
    }

    /**
     * {@code POST  /product-carts} : Create a new productCart.
     *
     * @param productCart the productCart to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productCart, or with status {@code 400 (Bad Request)} if the productCart has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-carts")
    public ResponseEntity<ProductCart> createProductCart(@Valid @RequestBody ProductCart productCart) throws URISyntaxException {
        log.debug("REST request to save ProductCart : {}", productCart);
        if (productCart.getId() != null) {
            throw new BadRequestAlertException("A new productCart cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductCart result = productCartService.save(productCart);
        return ResponseEntity
            .created(new URI("/api/product-carts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-carts/:id} : Updates an existing productCart.
     *
     * @param id the id of the productCart to save.
     * @param productCart the productCart to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productCart,
     * or with status {@code 400 (Bad Request)} if the productCart is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productCart couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-carts/{id}")
    public ResponseEntity<ProductCart> updateProductCart(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProductCart productCart
    ) throws URISyntaxException {
        log.debug("REST request to update ProductCart : {}, {}", id, productCart);
        if (productCart.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productCart.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productCartRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProductCart result = productCartService.save(productCart);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productCart.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /product-carts/:id} : Partial updates given fields of an existing productCart, field will ignore if it is null
     *
     * @param id the id of the productCart to save.
     * @param productCart the productCart to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productCart,
     * or with status {@code 400 (Bad Request)} if the productCart is not valid,
     * or with status {@code 404 (Not Found)} if the productCart is not found,
     * or with status {@code 500 (Internal Server Error)} if the productCart couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/product-carts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProductCart> partialUpdateProductCart(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProductCart productCart
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProductCart partially : {}, {}", id, productCart);
        if (productCart.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productCart.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productCartRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductCart> result = productCartService.partialUpdate(productCart);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productCart.getId().toString())
        );
    }

    /**
     * {@code GET  /product-carts} : get all the productCarts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productCarts in body.
     */
    @GetMapping("/product-carts")
    public List<ProductCart> getAllProductCarts() {
        log.debug("REST request to get all ProductCarts");
        return productCartService.findAll();
    }

    /**
     * {@code GET  /product-carts/:id} : get the "id" productCart.
     *
     * @param id the id of the productCart to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productCart, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-carts/{id}")
    public ResponseEntity<ProductCart> getProductCart(@PathVariable Long id) {
        log.debug("REST request to get ProductCart : {}", id);
        Optional<ProductCart> productCart = productCartService.findOne(id);
        return ResponseUtil.wrapOrNotFound(productCart);
    }

    /**
     * {@code DELETE  /product-carts/:id} : delete the "id" productCart.
     *
     * @param id the id of the productCart to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-carts/{id}")
    public ResponseEntity<Void> deleteProductCart(@PathVariable Long id) {
        log.debug("REST request to delete ProductCart : {}", id);
        productCartService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
