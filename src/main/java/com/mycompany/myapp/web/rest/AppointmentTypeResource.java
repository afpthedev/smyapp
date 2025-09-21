package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.AppointmentTypeRepository;
import com.mycompany.myapp.service.AppointmentTypeQueryService;
import com.mycompany.myapp.service.AppointmentTypeService;
import com.mycompany.myapp.service.criteria.AppointmentTypeCriteria;
import com.mycompany.myapp.service.dto.AppointmentTypeDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.AppointmentType}.
 */
@RestController
@RequestMapping("/api/appointment-types")
public class AppointmentTypeResource {

    private static final Logger LOG = LoggerFactory.getLogger(AppointmentTypeResource.class);

    private static final String ENTITY_NAME = "appointmentType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AppointmentTypeService appointmentTypeService;

    private final AppointmentTypeRepository appointmentTypeRepository;

    private final AppointmentTypeQueryService appointmentTypeQueryService;

    public AppointmentTypeResource(
        AppointmentTypeService appointmentTypeService,
        AppointmentTypeRepository appointmentTypeRepository,
        AppointmentTypeQueryService appointmentTypeQueryService
    ) {
        this.appointmentTypeService = appointmentTypeService;
        this.appointmentTypeRepository = appointmentTypeRepository;
        this.appointmentTypeQueryService = appointmentTypeQueryService;
    }

    /**
     * {@code POST  /appointment-types} : Create a new appointmentType.
     *
     * @param appointmentTypeDTO the appointmentTypeDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new appointmentTypeDTO, or with status {@code 400 (Bad Request)} if the appointmentType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AppointmentTypeDTO> createAppointmentType(@Valid @RequestBody AppointmentTypeDTO appointmentTypeDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save AppointmentType : {}", appointmentTypeDTO);
        if (appointmentTypeDTO.getId() != null) {
            throw new BadRequestAlertException("A new appointmentType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        appointmentTypeDTO = appointmentTypeService.save(appointmentTypeDTO);
        return ResponseEntity.created(new URI("/api/appointment-types/" + appointmentTypeDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, appointmentTypeDTO.getId().toString()))
            .body(appointmentTypeDTO);
    }

    /**
     * {@code PUT  /appointment-types/:id} : Updates an existing appointmentType.
     *
     * @param id the id of the appointmentTypeDTO to save.
     * @param appointmentTypeDTO the appointmentTypeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appointmentTypeDTO,
     * or with status {@code 400 (Bad Request)} if the appointmentTypeDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the appointmentTypeDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AppointmentTypeDTO> updateAppointmentType(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AppointmentTypeDTO appointmentTypeDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update AppointmentType : {}, {}", id, appointmentTypeDTO);
        if (appointmentTypeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appointmentTypeDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appointmentTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        appointmentTypeDTO = appointmentTypeService.update(appointmentTypeDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, appointmentTypeDTO.getId().toString()))
            .body(appointmentTypeDTO);
    }

    /**
     * {@code PATCH  /appointment-types/:id} : Partial updates given fields of an existing appointmentType, field will ignore if it is null
     *
     * @param id the id of the appointmentTypeDTO to save.
     * @param appointmentTypeDTO the appointmentTypeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appointmentTypeDTO,
     * or with status {@code 400 (Bad Request)} if the appointmentTypeDTO is not valid,
     * or with status {@code 404 (Not Found)} if the appointmentTypeDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the appointmentTypeDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AppointmentTypeDTO> partialUpdateAppointmentType(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AppointmentTypeDTO appointmentTypeDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update AppointmentType partially : {}, {}", id, appointmentTypeDTO);
        if (appointmentTypeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appointmentTypeDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appointmentTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AppointmentTypeDTO> result = appointmentTypeService.partialUpdate(appointmentTypeDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, appointmentTypeDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /appointment-types} : get all the appointmentTypes.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of appointmentTypes in body.
     */
    @GetMapping("")
    public ResponseEntity<List<AppointmentTypeDTO>> getAllAppointmentTypes(
        AppointmentTypeCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get AppointmentTypes by criteria: {}", criteria);

        Page<AppointmentTypeDTO> page = appointmentTypeQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /appointment-types/count} : count all the appointmentTypes.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countAppointmentTypes(AppointmentTypeCriteria criteria) {
        LOG.debug("REST request to count AppointmentTypes by criteria: {}", criteria);
        return ResponseEntity.ok().body(appointmentTypeQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /appointment-types/:id} : get the "id" appointmentType.
     *
     * @param id the id of the appointmentTypeDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the appointmentTypeDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentTypeDTO> getAppointmentType(@PathVariable("id") Long id) {
        LOG.debug("REST request to get AppointmentType : {}", id);
        Optional<AppointmentTypeDTO> appointmentTypeDTO = appointmentTypeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(appointmentTypeDTO);
    }

    /**
     * {@code DELETE  /appointment-types/:id} : delete the "id" appointmentType.
     *
     * @param id the id of the appointmentTypeDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointmentType(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete AppointmentType : {}", id);
        appointmentTypeService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
