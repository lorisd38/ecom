package com.m2gi.ecom.web.rest;

import static com.m2gi.ecom.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.m2gi.ecom.IntegrationTest;
import com.m2gi.ecom.domain.PromotionalCode;
import com.m2gi.ecom.domain.enumeration.ReductionType;
import com.m2gi.ecom.repository.PromotionalCodeRepository;
import com.m2gi.ecom.service.PromotionalCodeService;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PromotionalCodeResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PromotionalCodeResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final BigDecimal DEFAULT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALUE = new BigDecimal(2);

    private static final ReductionType DEFAULT_UNIT = ReductionType.FIX;
    private static final ReductionType UPDATED_UNIT = ReductionType.PERCENTAGE;

    private static final String ENTITY_API_URL = "/api/promotional-codes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PromotionalCodeRepository promotionalCodeRepository;

    @Mock
    private PromotionalCodeRepository promotionalCodeRepositoryMock;

    @Mock
    private PromotionalCodeService promotionalCodeServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPromotionalCodeMockMvc;

    private PromotionalCode promotionalCode;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PromotionalCode createEntity(EntityManager em) {
        PromotionalCode promotionalCode = new PromotionalCode()
            .code(DEFAULT_CODE)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .value(DEFAULT_VALUE)
            .unit(DEFAULT_UNIT);
        return promotionalCode;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PromotionalCode createUpdatedEntity(EntityManager em) {
        PromotionalCode promotionalCode = new PromotionalCode()
            .code(UPDATED_CODE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .value(UPDATED_VALUE)
            .unit(UPDATED_UNIT);
        return promotionalCode;
    }

    @BeforeEach
    public void initTest() {
        promotionalCode = createEntity(em);
    }

    @Test
    @Transactional
    void createPromotionalCode() throws Exception {
        int databaseSizeBeforeCreate = promotionalCodeRepository.findAll().size();
        // Create the PromotionalCode
        restPromotionalCodeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(promotionalCode))
            )
            .andExpect(status().isCreated());

        // Validate the PromotionalCode in the database
        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeCreate + 1);
        PromotionalCode testPromotionalCode = promotionalCodeList.get(promotionalCodeList.size() - 1);
        assertThat(testPromotionalCode.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testPromotionalCode.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testPromotionalCode.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testPromotionalCode.getValue()).isEqualByComparingTo(DEFAULT_VALUE);
        assertThat(testPromotionalCode.getUnit()).isEqualTo(DEFAULT_UNIT);
    }

    @Test
    @Transactional
    void createPromotionalCodeWithExistingId() throws Exception {
        // Create the PromotionalCode with an existing ID
        promotionalCode.setId(1L);

        int databaseSizeBeforeCreate = promotionalCodeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPromotionalCodeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(promotionalCode))
            )
            .andExpect(status().isBadRequest());

        // Validate the PromotionalCode in the database
        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = promotionalCodeRepository.findAll().size();
        // set the field null
        promotionalCode.setCode(null);

        // Create the PromotionalCode, which fails.

        restPromotionalCodeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(promotionalCode))
            )
            .andExpect(status().isBadRequest());

        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStartDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = promotionalCodeRepository.findAll().size();
        // set the field null
        promotionalCode.setStartDate(null);

        // Create the PromotionalCode, which fails.

        restPromotionalCodeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(promotionalCode))
            )
            .andExpect(status().isBadRequest());

        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEndDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = promotionalCodeRepository.findAll().size();
        // set the field null
        promotionalCode.setEndDate(null);

        // Create the PromotionalCode, which fails.

        restPromotionalCodeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(promotionalCode))
            )
            .andExpect(status().isBadRequest());

        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = promotionalCodeRepository.findAll().size();
        // set the field null
        promotionalCode.setValue(null);

        // Create the PromotionalCode, which fails.

        restPromotionalCodeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(promotionalCode))
            )
            .andExpect(status().isBadRequest());

        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkUnitIsRequired() throws Exception {
        int databaseSizeBeforeTest = promotionalCodeRepository.findAll().size();
        // set the field null
        promotionalCode.setUnit(null);

        // Create the PromotionalCode, which fails.

        restPromotionalCodeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(promotionalCode))
            )
            .andExpect(status().isBadRequest());

        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPromotionalCodes() throws Exception {
        // Initialize the database
        promotionalCodeRepository.saveAndFlush(promotionalCode);

        // Get all the promotionalCodeList
        restPromotionalCodeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(promotionalCode.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(sameNumber(DEFAULT_VALUE))))
            .andExpect(jsonPath("$.[*].unit").value(hasItem(DEFAULT_UNIT.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPromotionalCodesWithEagerRelationshipsIsEnabled() throws Exception {
        when(promotionalCodeServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPromotionalCodeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(promotionalCodeServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPromotionalCodesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(promotionalCodeServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPromotionalCodeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(promotionalCodeServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getPromotionalCode() throws Exception {
        // Initialize the database
        promotionalCodeRepository.saveAndFlush(promotionalCode);

        // Get the promotionalCode
        restPromotionalCodeMockMvc
            .perform(get(ENTITY_API_URL_ID, promotionalCode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(promotionalCode.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.value").value(sameNumber(DEFAULT_VALUE)))
            .andExpect(jsonPath("$.unit").value(DEFAULT_UNIT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPromotionalCode() throws Exception {
        // Get the promotionalCode
        restPromotionalCodeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPromotionalCode() throws Exception {
        // Initialize the database
        promotionalCodeRepository.saveAndFlush(promotionalCode);

        int databaseSizeBeforeUpdate = promotionalCodeRepository.findAll().size();

        // Update the promotionalCode
        PromotionalCode updatedPromotionalCode = promotionalCodeRepository.findById(promotionalCode.getId()).get();
        // Disconnect from session so that the updates on updatedPromotionalCode are not directly saved in db
        em.detach(updatedPromotionalCode);
        updatedPromotionalCode
            .code(UPDATED_CODE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .value(UPDATED_VALUE)
            .unit(UPDATED_UNIT);

        restPromotionalCodeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPromotionalCode.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPromotionalCode))
            )
            .andExpect(status().isOk());

        // Validate the PromotionalCode in the database
        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeUpdate);
        PromotionalCode testPromotionalCode = promotionalCodeList.get(promotionalCodeList.size() - 1);
        assertThat(testPromotionalCode.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testPromotionalCode.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testPromotionalCode.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testPromotionalCode.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testPromotionalCode.getUnit()).isEqualTo(UPDATED_UNIT);
    }

    @Test
    @Transactional
    void putNonExistingPromotionalCode() throws Exception {
        int databaseSizeBeforeUpdate = promotionalCodeRepository.findAll().size();
        promotionalCode.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPromotionalCodeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, promotionalCode.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(promotionalCode))
            )
            .andExpect(status().isBadRequest());

        // Validate the PromotionalCode in the database
        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPromotionalCode() throws Exception {
        int databaseSizeBeforeUpdate = promotionalCodeRepository.findAll().size();
        promotionalCode.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromotionalCodeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(promotionalCode))
            )
            .andExpect(status().isBadRequest());

        // Validate the PromotionalCode in the database
        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPromotionalCode() throws Exception {
        int databaseSizeBeforeUpdate = promotionalCodeRepository.findAll().size();
        promotionalCode.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromotionalCodeMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(promotionalCode))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PromotionalCode in the database
        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePromotionalCodeWithPatch() throws Exception {
        // Initialize the database
        promotionalCodeRepository.saveAndFlush(promotionalCode);

        int databaseSizeBeforeUpdate = promotionalCodeRepository.findAll().size();

        // Update the promotionalCode using partial update
        PromotionalCode partialUpdatedPromotionalCode = new PromotionalCode();
        partialUpdatedPromotionalCode.setId(promotionalCode.getId());

        partialUpdatedPromotionalCode.code(UPDATED_CODE).value(UPDATED_VALUE);

        restPromotionalCodeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPromotionalCode.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPromotionalCode))
            )
            .andExpect(status().isOk());

        // Validate the PromotionalCode in the database
        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeUpdate);
        PromotionalCode testPromotionalCode = promotionalCodeList.get(promotionalCodeList.size() - 1);
        assertThat(testPromotionalCode.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testPromotionalCode.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testPromotionalCode.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testPromotionalCode.getValue()).isEqualByComparingTo(UPDATED_VALUE);
        assertThat(testPromotionalCode.getUnit()).isEqualTo(DEFAULT_UNIT);
    }

    @Test
    @Transactional
    void fullUpdatePromotionalCodeWithPatch() throws Exception {
        // Initialize the database
        promotionalCodeRepository.saveAndFlush(promotionalCode);

        int databaseSizeBeforeUpdate = promotionalCodeRepository.findAll().size();

        // Update the promotionalCode using partial update
        PromotionalCode partialUpdatedPromotionalCode = new PromotionalCode();
        partialUpdatedPromotionalCode.setId(promotionalCode.getId());

        partialUpdatedPromotionalCode
            .code(UPDATED_CODE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .value(UPDATED_VALUE)
            .unit(UPDATED_UNIT);

        restPromotionalCodeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPromotionalCode.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPromotionalCode))
            )
            .andExpect(status().isOk());

        // Validate the PromotionalCode in the database
        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeUpdate);
        PromotionalCode testPromotionalCode = promotionalCodeList.get(promotionalCodeList.size() - 1);
        assertThat(testPromotionalCode.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testPromotionalCode.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testPromotionalCode.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testPromotionalCode.getValue()).isEqualByComparingTo(UPDATED_VALUE);
        assertThat(testPromotionalCode.getUnit()).isEqualTo(UPDATED_UNIT);
    }

    @Test
    @Transactional
    void patchNonExistingPromotionalCode() throws Exception {
        int databaseSizeBeforeUpdate = promotionalCodeRepository.findAll().size();
        promotionalCode.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPromotionalCodeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, promotionalCode.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(promotionalCode))
            )
            .andExpect(status().isBadRequest());

        // Validate the PromotionalCode in the database
        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPromotionalCode() throws Exception {
        int databaseSizeBeforeUpdate = promotionalCodeRepository.findAll().size();
        promotionalCode.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromotionalCodeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(promotionalCode))
            )
            .andExpect(status().isBadRequest());

        // Validate the PromotionalCode in the database
        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPromotionalCode() throws Exception {
        int databaseSizeBeforeUpdate = promotionalCodeRepository.findAll().size();
        promotionalCode.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPromotionalCodeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(promotionalCode))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PromotionalCode in the database
        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePromotionalCode() throws Exception {
        // Initialize the database
        promotionalCodeRepository.saveAndFlush(promotionalCode);

        int databaseSizeBeforeDelete = promotionalCodeRepository.findAll().size();

        // Delete the promotionalCode
        restPromotionalCodeMockMvc
            .perform(delete(ENTITY_API_URL_ID, promotionalCode.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PromotionalCode> promotionalCodeList = promotionalCodeRepository.findAll();
        assertThat(promotionalCodeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
