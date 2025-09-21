package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.AppointmentTypeAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.AppointmentType;
import com.mycompany.myapp.repository.AppointmentTypeRepository;
import com.mycompany.myapp.service.dto.AppointmentTypeDTO;
import com.mycompany.myapp.service.mapper.AppointmentTypeMapper;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link AppointmentTypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AppointmentTypeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_COLOR = "#5f7Ffb";
    private static final String UPDATED_COLOR = "#e1cF81";

    private static final Boolean DEFAULT_IS_ACTIVE = false;
    private static final Boolean UPDATED_IS_ACTIVE = true;

    private static final String ENTITY_API_URL = "/api/appointment-types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AppointmentTypeRepository appointmentTypeRepository;

    @Autowired
    private AppointmentTypeMapper appointmentTypeMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAppointmentTypeMockMvc;

    private AppointmentType appointmentType;

    private AppointmentType insertedAppointmentType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppointmentType createEntity() {
        return new AppointmentType().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION).color(DEFAULT_COLOR).isActive(DEFAULT_IS_ACTIVE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppointmentType createUpdatedEntity() {
        return new AppointmentType().name(UPDATED_NAME).description(UPDATED_DESCRIPTION).color(UPDATED_COLOR).isActive(UPDATED_IS_ACTIVE);
    }

    @BeforeEach
    void initTest() {
        appointmentType = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedAppointmentType != null) {
            appointmentTypeRepository.delete(insertedAppointmentType);
            insertedAppointmentType = null;
        }
    }

    @Test
    @Transactional
    void createAppointmentType() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the AppointmentType
        AppointmentTypeDTO appointmentTypeDTO = appointmentTypeMapper.toDto(appointmentType);
        var returnedAppointmentTypeDTO = om.readValue(
            restAppointmentTypeMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(appointmentTypeDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AppointmentTypeDTO.class
        );

        // Validate the AppointmentType in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedAppointmentType = appointmentTypeMapper.toEntity(returnedAppointmentTypeDTO);
        assertAppointmentTypeUpdatableFieldsEquals(returnedAppointmentType, getPersistedAppointmentType(returnedAppointmentType));

        insertedAppointmentType = returnedAppointmentType;
    }

    @Test
    @Transactional
    void createAppointmentTypeWithExistingId() throws Exception {
        // Create the AppointmentType with an existing ID
        appointmentType.setId(1L);
        AppointmentTypeDTO appointmentTypeDTO = appointmentTypeMapper.toDto(appointmentType);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAppointmentTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(appointmentTypeDTO)))
            .andExpect(status().isBadRequest());

        // Validate the AppointmentType in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        appointmentType.setName(null);

        // Create the AppointmentType, which fails.
        AppointmentTypeDTO appointmentTypeDTO = appointmentTypeMapper.toDto(appointmentType);

        restAppointmentTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(appointmentTypeDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIsActiveIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        appointmentType.setIsActive(null);

        // Create the AppointmentType, which fails.
        AppointmentTypeDTO appointmentTypeDTO = appointmentTypeMapper.toDto(appointmentType);

        restAppointmentTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(appointmentTypeDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAppointmentTypes() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList
        restAppointmentTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(appointmentType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR)))
            .andExpect(jsonPath("$.[*].isActive").value(hasItem(DEFAULT_IS_ACTIVE)));
    }

    @Test
    @Transactional
    void getAppointmentType() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get the appointmentType
        restAppointmentTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, appointmentType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(appointmentType.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.color").value(DEFAULT_COLOR))
            .andExpect(jsonPath("$.isActive").value(DEFAULT_IS_ACTIVE));
    }

    @Test
    @Transactional
    void getAppointmentTypesByIdFiltering() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        Long id = appointmentType.getId();

        defaultAppointmentTypeFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultAppointmentTypeFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultAppointmentTypeFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where name equals to
        defaultAppointmentTypeFiltering("name.equals=" + DEFAULT_NAME, "name.equals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByNameIsInShouldWork() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where name in
        defaultAppointmentTypeFiltering("name.in=" + DEFAULT_NAME + "," + UPDATED_NAME, "name.in=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where name is not null
        defaultAppointmentTypeFiltering("name.specified=true", "name.specified=false");
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByNameContainsSomething() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where name contains
        defaultAppointmentTypeFiltering("name.contains=" + DEFAULT_NAME, "name.contains=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByNameNotContainsSomething() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where name does not contain
        defaultAppointmentTypeFiltering("name.doesNotContain=" + UPDATED_NAME, "name.doesNotContain=" + DEFAULT_NAME);
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByDescriptionIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where description equals to
        defaultAppointmentTypeFiltering("description.equals=" + DEFAULT_DESCRIPTION, "description.equals=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByDescriptionIsInShouldWork() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where description in
        defaultAppointmentTypeFiltering(
            "description.in=" + DEFAULT_DESCRIPTION + "," + UPDATED_DESCRIPTION,
            "description.in=" + UPDATED_DESCRIPTION
        );
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByDescriptionIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where description is not null
        defaultAppointmentTypeFiltering("description.specified=true", "description.specified=false");
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByDescriptionContainsSomething() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where description contains
        defaultAppointmentTypeFiltering("description.contains=" + DEFAULT_DESCRIPTION, "description.contains=" + UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByDescriptionNotContainsSomething() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where description does not contain
        defaultAppointmentTypeFiltering(
            "description.doesNotContain=" + UPDATED_DESCRIPTION,
            "description.doesNotContain=" + DEFAULT_DESCRIPTION
        );
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByColorIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where color equals to
        defaultAppointmentTypeFiltering("color.equals=" + DEFAULT_COLOR, "color.equals=" + UPDATED_COLOR);
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByColorIsInShouldWork() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where color in
        defaultAppointmentTypeFiltering("color.in=" + DEFAULT_COLOR + "," + UPDATED_COLOR, "color.in=" + UPDATED_COLOR);
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByColorIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where color is not null
        defaultAppointmentTypeFiltering("color.specified=true", "color.specified=false");
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByColorContainsSomething() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where color contains
        defaultAppointmentTypeFiltering("color.contains=" + DEFAULT_COLOR, "color.contains=" + UPDATED_COLOR);
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByColorNotContainsSomething() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where color does not contain
        defaultAppointmentTypeFiltering("color.doesNotContain=" + UPDATED_COLOR, "color.doesNotContain=" + DEFAULT_COLOR);
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByIsActiveIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where isActive equals to
        defaultAppointmentTypeFiltering("isActive.equals=" + DEFAULT_IS_ACTIVE, "isActive.equals=" + UPDATED_IS_ACTIVE);
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByIsActiveIsInShouldWork() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where isActive in
        defaultAppointmentTypeFiltering("isActive.in=" + DEFAULT_IS_ACTIVE + "," + UPDATED_IS_ACTIVE, "isActive.in=" + UPDATED_IS_ACTIVE);
    }

    @Test
    @Transactional
    void getAllAppointmentTypesByIsActiveIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        // Get all the appointmentTypeList where isActive is not null
        defaultAppointmentTypeFiltering("isActive.specified=true", "isActive.specified=false");
    }

    private void defaultAppointmentTypeFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultAppointmentTypeShouldBeFound(shouldBeFound);
        defaultAppointmentTypeShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultAppointmentTypeShouldBeFound(String filter) throws Exception {
        restAppointmentTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(appointmentType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR)))
            .andExpect(jsonPath("$.[*].isActive").value(hasItem(DEFAULT_IS_ACTIVE)));

        // Check, that the count call also returns 1
        restAppointmentTypeMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultAppointmentTypeShouldNotBeFound(String filter) throws Exception {
        restAppointmentTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restAppointmentTypeMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingAppointmentType() throws Exception {
        // Get the appointmentType
        restAppointmentTypeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAppointmentType() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the appointmentType
        AppointmentType updatedAppointmentType = appointmentTypeRepository.findById(appointmentType.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAppointmentType are not directly saved in db
        em.detach(updatedAppointmentType);
        updatedAppointmentType.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).color(UPDATED_COLOR).isActive(UPDATED_IS_ACTIVE);
        AppointmentTypeDTO appointmentTypeDTO = appointmentTypeMapper.toDto(updatedAppointmentType);

        restAppointmentTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, appointmentTypeDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(appointmentTypeDTO))
            )
            .andExpect(status().isOk());

        // Validate the AppointmentType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAppointmentTypeToMatchAllProperties(updatedAppointmentType);
    }

    @Test
    @Transactional
    void putNonExistingAppointmentType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        appointmentType.setId(longCount.incrementAndGet());

        // Create the AppointmentType
        AppointmentTypeDTO appointmentTypeDTO = appointmentTypeMapper.toDto(appointmentType);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppointmentTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, appointmentTypeDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(appointmentTypeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppointmentType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAppointmentType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        appointmentType.setId(longCount.incrementAndGet());

        // Create the AppointmentType
        AppointmentTypeDTO appointmentTypeDTO = appointmentTypeMapper.toDto(appointmentType);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppointmentTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(appointmentTypeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppointmentType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAppointmentType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        appointmentType.setId(longCount.incrementAndGet());

        // Create the AppointmentType
        AppointmentTypeDTO appointmentTypeDTO = appointmentTypeMapper.toDto(appointmentType);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppointmentTypeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(appointmentTypeDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppointmentType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAppointmentTypeWithPatch() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the appointmentType using partial update
        AppointmentType partialUpdatedAppointmentType = new AppointmentType();
        partialUpdatedAppointmentType.setId(appointmentType.getId());

        restAppointmentTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppointmentType.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAppointmentType))
            )
            .andExpect(status().isOk());

        // Validate the AppointmentType in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAppointmentTypeUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAppointmentType, appointmentType),
            getPersistedAppointmentType(appointmentType)
        );
    }

    @Test
    @Transactional
    void fullUpdateAppointmentTypeWithPatch() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the appointmentType using partial update
        AppointmentType partialUpdatedAppointmentType = new AppointmentType();
        partialUpdatedAppointmentType.setId(appointmentType.getId());

        partialUpdatedAppointmentType.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).color(UPDATED_COLOR).isActive(UPDATED_IS_ACTIVE);

        restAppointmentTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppointmentType.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAppointmentType))
            )
            .andExpect(status().isOk());

        // Validate the AppointmentType in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAppointmentTypeUpdatableFieldsEquals(
            partialUpdatedAppointmentType,
            getPersistedAppointmentType(partialUpdatedAppointmentType)
        );
    }

    @Test
    @Transactional
    void patchNonExistingAppointmentType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        appointmentType.setId(longCount.incrementAndGet());

        // Create the AppointmentType
        AppointmentTypeDTO appointmentTypeDTO = appointmentTypeMapper.toDto(appointmentType);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppointmentTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, appointmentTypeDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(appointmentTypeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppointmentType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAppointmentType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        appointmentType.setId(longCount.incrementAndGet());

        // Create the AppointmentType
        AppointmentTypeDTO appointmentTypeDTO = appointmentTypeMapper.toDto(appointmentType);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppointmentTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(appointmentTypeDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppointmentType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAppointmentType() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        appointmentType.setId(longCount.incrementAndGet());

        // Create the AppointmentType
        AppointmentTypeDTO appointmentTypeDTO = appointmentTypeMapper.toDto(appointmentType);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppointmentTypeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(appointmentTypeDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppointmentType in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAppointmentType() throws Exception {
        // Initialize the database
        insertedAppointmentType = appointmentTypeRepository.saveAndFlush(appointmentType);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the appointmentType
        restAppointmentTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, appointmentType.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return appointmentTypeRepository.count();
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

    protected AppointmentType getPersistedAppointmentType(AppointmentType appointmentType) {
        return appointmentTypeRepository.findById(appointmentType.getId()).orElseThrow();
    }

    protected void assertPersistedAppointmentTypeToMatchAllProperties(AppointmentType expectedAppointmentType) {
        assertAppointmentTypeAllPropertiesEquals(expectedAppointmentType, getPersistedAppointmentType(expectedAppointmentType));
    }

    protected void assertPersistedAppointmentTypeToMatchUpdatableProperties(AppointmentType expectedAppointmentType) {
        assertAppointmentTypeAllUpdatablePropertiesEquals(expectedAppointmentType, getPersistedAppointmentType(expectedAppointmentType));
    }
}
