package com.mycompany.reservation.web.rest;

import static com.mycompany.reservation.domain.OfferedServiceAsserts.*;
import static com.mycompany.reservation.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.reservation.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.reservation.IntegrationTest;
import com.mycompany.reservation.domain.OfferedService;
import com.mycompany.reservation.repository.OfferedServiceRepository;
import com.mycompany.reservation.service.dto.OfferedServiceDTO;
import com.mycompany.reservation.service.mapper.OfferedServiceMapper;
import jakarta.persistence.EntityManager;

import java.math.BigDecimal;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OfferedServiceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OfferedServiceResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_DURATION = 1;
    private static final Integer UPDATED_DURATION = 2;

    private static final BigDecimal DEFAULT_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICE = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/offered-services";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private OfferedServiceRepository offeredServiceRepository;

    @Autowired
    private OfferedServiceMapper offeredServiceMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOfferedServiceMockMvc;

    private OfferedService offeredService;

    private OfferedService insertedOfferedService;

    /**
     * Create an entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OfferedService createEntity() {
        return new OfferedService().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION).duration(DEFAULT_DURATION).price(DEFAULT_PRICE);
    }

    /**
     * Create an updated entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OfferedService createUpdatedEntity() {
        return new OfferedService().name(UPDATED_NAME).description(UPDATED_DESCRIPTION).duration(UPDATED_DURATION).price(UPDATED_PRICE);
    }

    @BeforeEach
    void initTest() {
        offeredService = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedOfferedService != null) {
            offeredServiceRepository.delete(insertedOfferedService);
            insertedOfferedService = null;
        }
    }

    @Test
    @Transactional
    void createOfferedService() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the OfferedService
        OfferedServiceDTO offeredServiceDTO = offeredServiceMapper.toDto(offeredService);
        var returnedOfferedServiceDTO = om.readValue(
            restOfferedServiceMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(offeredServiceDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            OfferedServiceDTO.class
        );

        // Validate the OfferedService in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedOfferedService = offeredServiceMapper.toEntity(returnedOfferedServiceDTO);
        assertOfferedServiceUpdatableFieldsEquals(returnedOfferedService, getPersistedOfferedService(returnedOfferedService));

        insertedOfferedService = returnedOfferedService;
    }

    @Test
    @Transactional
    void createOfferedServiceWithExistingId() throws Exception {
        // Create the OfferedService with an existing ID
        offeredService.setId(1L);
        OfferedServiceDTO offeredServiceDTO = offeredServiceMapper.toDto(offeredService);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOfferedServiceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(offeredServiceDTO)))
            .andExpect(status().isBadRequest());

        // Validate the OfferedService in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        offeredService.setName(null);

        // Create the OfferedService, which fails.
        OfferedServiceDTO offeredServiceDTO = offeredServiceMapper.toDto(offeredService);

        restOfferedServiceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(offeredServiceDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOfferedServices() throws Exception {
        // Initialize the database
        insertedOfferedService = offeredServiceRepository.saveAndFlush(offeredService);

        // Get all the offeredServiceList
        restOfferedServiceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(offeredService.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(sameNumber(DEFAULT_PRICE))));
    }

    @Test
    @Transactional
    void getOfferedService() throws Exception {
        // Initialize the database
        insertedOfferedService = offeredServiceRepository.saveAndFlush(offeredService);

        // Get the offeredService
        restOfferedServiceMockMvc
            .perform(get(ENTITY_API_URL_ID, offeredService.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(offeredService.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION))
            .andExpect(jsonPath("$.price").value(sameNumber(DEFAULT_PRICE)));
    }

    @Test
    @Transactional
    void getNonExistingOfferedService() throws Exception {
        // Get the offeredService
        restOfferedServiceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOfferedService() throws Exception {
        // Initialize the database
        insertedOfferedService = offeredServiceRepository.saveAndFlush(offeredService);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the offeredService
        OfferedService updatedOfferedService = offeredServiceRepository.findById(offeredService.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedOfferedService are not directly saved in db
        em.detach(updatedOfferedService);
        updatedOfferedService.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).duration(UPDATED_DURATION).price(UPDATED_PRICE);
        OfferedServiceDTO offeredServiceDTO = offeredServiceMapper.toDto(updatedOfferedService);

        restOfferedServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, offeredServiceDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(offeredServiceDTO))
            )
            .andExpect(status().isOk());

        // Validate the OfferedService in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedOfferedServiceToMatchAllProperties(updatedOfferedService);
    }

    @Test
    @Transactional
    void putNonExistingOfferedService() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        offeredService.setId(longCount.incrementAndGet());

        // Create the OfferedService
        OfferedServiceDTO offeredServiceDTO = offeredServiceMapper.toDto(offeredService);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOfferedServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, offeredServiceDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(offeredServiceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the OfferedService in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOfferedService() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        offeredService.setId(longCount.incrementAndGet());

        // Create the OfferedService
        OfferedServiceDTO offeredServiceDTO = offeredServiceMapper.toDto(offeredService);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOfferedServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(offeredServiceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the OfferedService in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOfferedService() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        offeredService.setId(longCount.incrementAndGet());

        // Create the OfferedService
        OfferedServiceDTO offeredServiceDTO = offeredServiceMapper.toDto(offeredService);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOfferedServiceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(offeredServiceDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OfferedService in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOfferedServiceWithPatch() throws Exception {
        // Initialize the database
        insertedOfferedService = offeredServiceRepository.saveAndFlush(offeredService);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the offeredService using partial update
        OfferedService partialUpdatedOfferedService = new OfferedService();
        partialUpdatedOfferedService.setId(offeredService.getId());

        partialUpdatedOfferedService.description(UPDATED_DESCRIPTION).price(UPDATED_PRICE);

        restOfferedServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOfferedService.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOfferedService))
            )
            .andExpect(status().isOk());

        // Validate the OfferedService in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOfferedServiceUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedOfferedService, offeredService),
            getPersistedOfferedService(offeredService)
        );
    }

    @Test
    @Transactional
    void fullUpdateOfferedServiceWithPatch() throws Exception {
        // Initialize the database
        insertedOfferedService = offeredServiceRepository.saveAndFlush(offeredService);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the offeredService using partial update
        OfferedService partialUpdatedOfferedService = new OfferedService();
        partialUpdatedOfferedService.setId(offeredService.getId());

        partialUpdatedOfferedService.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).duration(UPDATED_DURATION).price(UPDATED_PRICE);

        restOfferedServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOfferedService.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOfferedService))
            )
            .andExpect(status().isOk());

        // Validate the OfferedService in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOfferedServiceUpdatableFieldsEquals(partialUpdatedOfferedService, getPersistedOfferedService(partialUpdatedOfferedService));
    }

    @Test
    @Transactional
    void patchNonExistingOfferedService() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        offeredService.setId(longCount.incrementAndGet());

        // Create the OfferedService
        OfferedServiceDTO offeredServiceDTO = offeredServiceMapper.toDto(offeredService);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOfferedServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, offeredServiceDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(offeredServiceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the OfferedService in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOfferedService() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        offeredService.setId(longCount.incrementAndGet());

        // Create the OfferedService
        OfferedServiceDTO offeredServiceDTO = offeredServiceMapper.toDto(offeredService);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOfferedServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(offeredServiceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the OfferedService in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOfferedService() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        offeredService.setId(longCount.incrementAndGet());

        // Create the OfferedService
        OfferedServiceDTO offeredServiceDTO = offeredServiceMapper.toDto(offeredService);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOfferedServiceMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(offeredServiceDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OfferedService in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOfferedService() throws Exception {
        // Initialize the database
        insertedOfferedService = offeredServiceRepository.saveAndFlush(offeredService);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the offeredService
        restOfferedServiceMockMvc
            .perform(delete(ENTITY_API_URL_ID, offeredService.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return offeredServiceRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected OfferedService getPersistedOfferedService(OfferedService offeredService) {
        return offeredServiceRepository.findById(offeredService.getId()).orElseThrow();
    }

    protected void assertPersistedOfferedServiceToMatchAllProperties(OfferedService expectedOfferedService) {
        assertOfferedServiceAllPropertiesEquals(expectedOfferedService, getPersistedOfferedService(expectedOfferedService));
    }

    protected void assertPersistedOfferedServiceToMatchUpdatableProperties(OfferedService expectedOfferedService) {
        assertOfferedServiceAllUpdatablePropertiesEquals(expectedOfferedService, getPersistedOfferedService(expectedOfferedService));
    }
}
