package com.m2gi.ecom.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.m2gi.ecom.IntegrationTest;
import com.m2gi.ecom.domain.ProductCart;
import com.m2gi.ecom.repository.ProductCartRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProductCartResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductCartResourceIT {

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final Instant DEFAULT_CREATION_DATETIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATION_DATETIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/product-carts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProductCartRepository productCartRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductCartMockMvc;

    private ProductCart productCart;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductCart createEntity(EntityManager em) {
        ProductCart productCart = new ProductCart().quantity(DEFAULT_QUANTITY).creationDatetime(DEFAULT_CREATION_DATETIME);
        return productCart;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductCart createUpdatedEntity(EntityManager em) {
        ProductCart productCart = new ProductCart().quantity(UPDATED_QUANTITY).creationDatetime(UPDATED_CREATION_DATETIME);
        return productCart;
    }

    @BeforeEach
    public void initTest() {
        productCart = createEntity(em);
    }

    @Test
    @Transactional
    void createProductCart() throws Exception {
        int databaseSizeBeforeCreate = productCartRepository.findAll().size();
        // Create the ProductCart
        restProductCartMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productCart)))
            .andExpect(status().isCreated());

        // Validate the ProductCart in the database
        List<ProductCart> productCartList = productCartRepository.findAll();
        assertThat(productCartList).hasSize(databaseSizeBeforeCreate + 1);
        ProductCart testProductCart = productCartList.get(productCartList.size() - 1);
        assertThat(testProductCart.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testProductCart.getCreationDatetime()).isEqualTo(DEFAULT_CREATION_DATETIME);
    }

    @Test
    @Transactional
    void createProductCartWithExistingId() throws Exception {
        // Create the ProductCart with an existing ID
        productCart.setId(1L);

        int databaseSizeBeforeCreate = productCartRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductCartMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productCart)))
            .andExpect(status().isBadRequest());

        // Validate the ProductCart in the database
        List<ProductCart> productCartList = productCartRepository.findAll();
        assertThat(productCartList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkQuantityIsRequired() throws Exception {
        int databaseSizeBeforeTest = productCartRepository.findAll().size();
        // set the field null
        productCart.setQuantity(null);

        // Create the ProductCart, which fails.

        restProductCartMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productCart)))
            .andExpect(status().isBadRequest());

        List<ProductCart> productCartList = productCartRepository.findAll();
        assertThat(productCartList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreationDatetimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = productCartRepository.findAll().size();
        // set the field null
        productCart.setCreationDatetime(null);

        // Create the ProductCart, which fails.

        restProductCartMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productCart)))
            .andExpect(status().isBadRequest());

        List<ProductCart> productCartList = productCartRepository.findAll();
        assertThat(productCartList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProductCarts() throws Exception {
        // Initialize the database
        productCartRepository.saveAndFlush(productCart);

        // Get all the productCartList
        restProductCartMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productCart.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].creationDatetime").value(hasItem(DEFAULT_CREATION_DATETIME.toString())));
    }

    @Test
    @Transactional
    void getProductCart() throws Exception {
        // Initialize the database
        productCartRepository.saveAndFlush(productCart);

        // Get the productCart
        restProductCartMockMvc
            .perform(get(ENTITY_API_URL_ID, productCart.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productCart.getId().intValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.creationDatetime").value(DEFAULT_CREATION_DATETIME.toString()));
    }

    @Test
    @Transactional
    void getNonExistingProductCart() throws Exception {
        // Get the productCart
        restProductCartMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProductCart() throws Exception {
        // Initialize the database
        productCartRepository.saveAndFlush(productCart);

        int databaseSizeBeforeUpdate = productCartRepository.findAll().size();

        // Update the productCart
        ProductCart updatedProductCart = productCartRepository.findById(productCart.getId()).get();
        // Disconnect from session so that the updates on updatedProductCart are not directly saved in db
        em.detach(updatedProductCart);
        updatedProductCart.quantity(UPDATED_QUANTITY).creationDatetime(UPDATED_CREATION_DATETIME);

        restProductCartMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProductCart.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProductCart))
            )
            .andExpect(status().isOk());

        // Validate the ProductCart in the database
        List<ProductCart> productCartList = productCartRepository.findAll();
        assertThat(productCartList).hasSize(databaseSizeBeforeUpdate);
        ProductCart testProductCart = productCartList.get(productCartList.size() - 1);
        assertThat(testProductCart.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testProductCart.getCreationDatetime()).isEqualTo(UPDATED_CREATION_DATETIME);
    }

    @Test
    @Transactional
    void putNonExistingProductCart() throws Exception {
        int databaseSizeBeforeUpdate = productCartRepository.findAll().size();
        productCart.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductCartMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productCart.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productCart))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductCart in the database
        List<ProductCart> productCartList = productCartRepository.findAll();
        assertThat(productCartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductCart() throws Exception {
        int databaseSizeBeforeUpdate = productCartRepository.findAll().size();
        productCart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductCartMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productCart))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductCart in the database
        List<ProductCart> productCartList = productCartRepository.findAll();
        assertThat(productCartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductCart() throws Exception {
        int databaseSizeBeforeUpdate = productCartRepository.findAll().size();
        productCart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductCartMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productCart)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductCart in the database
        List<ProductCart> productCartList = productCartRepository.findAll();
        assertThat(productCartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductCartWithPatch() throws Exception {
        // Initialize the database
        productCartRepository.saveAndFlush(productCart);

        int databaseSizeBeforeUpdate = productCartRepository.findAll().size();

        // Update the productCart using partial update
        ProductCart partialUpdatedProductCart = new ProductCart();
        partialUpdatedProductCart.setId(productCart.getId());

        restProductCartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductCart.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductCart))
            )
            .andExpect(status().isOk());

        // Validate the ProductCart in the database
        List<ProductCart> productCartList = productCartRepository.findAll();
        assertThat(productCartList).hasSize(databaseSizeBeforeUpdate);
        ProductCart testProductCart = productCartList.get(productCartList.size() - 1);
        assertThat(testProductCart.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testProductCart.getCreationDatetime()).isEqualTo(DEFAULT_CREATION_DATETIME);
    }

    @Test
    @Transactional
    void fullUpdateProductCartWithPatch() throws Exception {
        // Initialize the database
        productCartRepository.saveAndFlush(productCart);

        int databaseSizeBeforeUpdate = productCartRepository.findAll().size();

        // Update the productCart using partial update
        ProductCart partialUpdatedProductCart = new ProductCart();
        partialUpdatedProductCart.setId(productCart.getId());

        partialUpdatedProductCart.quantity(UPDATED_QUANTITY).creationDatetime(UPDATED_CREATION_DATETIME);

        restProductCartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductCart.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductCart))
            )
            .andExpect(status().isOk());

        // Validate the ProductCart in the database
        List<ProductCart> productCartList = productCartRepository.findAll();
        assertThat(productCartList).hasSize(databaseSizeBeforeUpdate);
        ProductCart testProductCart = productCartList.get(productCartList.size() - 1);
        assertThat(testProductCart.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testProductCart.getCreationDatetime()).isEqualTo(UPDATED_CREATION_DATETIME);
    }

    @Test
    @Transactional
    void patchNonExistingProductCart() throws Exception {
        int databaseSizeBeforeUpdate = productCartRepository.findAll().size();
        productCart.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductCartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productCart.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productCart))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductCart in the database
        List<ProductCart> productCartList = productCartRepository.findAll();
        assertThat(productCartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductCart() throws Exception {
        int databaseSizeBeforeUpdate = productCartRepository.findAll().size();
        productCart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductCartMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productCart))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductCart in the database
        List<ProductCart> productCartList = productCartRepository.findAll();
        assertThat(productCartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductCart() throws Exception {
        int databaseSizeBeforeUpdate = productCartRepository.findAll().size();
        productCart.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductCartMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(productCart))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductCart in the database
        List<ProductCart> productCartList = productCartRepository.findAll();
        assertThat(productCartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductCart() throws Exception {
        // Initialize the database
        productCartRepository.saveAndFlush(productCart);

        int databaseSizeBeforeDelete = productCartRepository.findAll().size();

        // Delete the productCart
        restProductCartMockMvc
            .perform(delete(ENTITY_API_URL_ID, productCart.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductCart> productCartList = productCartRepository.findAll();
        assertThat(productCartList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
