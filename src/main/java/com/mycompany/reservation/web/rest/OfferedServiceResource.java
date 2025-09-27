package com.mycompany.reservation.web.rest;

import com.mycompany.reservation.repository.OfferedServiceRepository;
import com.mycompany.reservation.service.OfferedServiceService;
import com.mycompany.reservation.service.dto.OfferedServiceDTO;
import com.mycompany.reservation.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link com.mycompany.reservation.domain.OfferedService}.
 */
@RestController
@RequestMapping("/api/offered-services")
public class OfferedServiceResource {

    private static final Logger LOG = LoggerFactory.getLogger(OfferedServiceResource.class);

    private static final String ENTITY_NAME = "offeredService";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OfferedServiceService offeredServiceService;

    private final OfferedServiceRepository offeredServiceRepository;

    public OfferedServiceResource(OfferedServiceService offeredServiceService, OfferedServiceRepository offeredServiceRepository) {
        this.offeredServiceService = offeredServiceService;
        this.offeredServiceRepository = offeredServiceRepository;
    }

    /**
     * {@code POST  /offered-services} : Create a new offeredService.
     *
     * @param offeredServiceDTO the offeredServiceDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new offeredServiceDTO, or with status {@code 400 (Bad Request)} if the offeredService has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<OfferedServiceDTO> createOfferedService(@Valid @RequestBody OfferedServiceDTO offeredServiceDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save OfferedService : {}", offeredServiceDTO);
        if (offeredServiceDTO.getId() != null) {
            throw new BadRequestAlertException("A new offeredService cannot already have an ID", ENTITY_NAME, "idexists");
        }
        offeredServiceDTO = offeredServiceService.save(offeredServiceDTO);
        return ResponseEntity.created(new URI("/api/offered-services/" + offeredServiceDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, offeredServiceDTO.getId().toString()))
            .body(offeredServiceDTO);
    }

    /**
     * {@code PUT  /offered-services/:id} : Updates an existing offeredService.
     *
     * @param id                the id of the offeredServiceDTO to save.
     * @param offeredServiceDTO the offeredServiceDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offeredServiceDTO,
     * or with status {@code 400 (Bad Request)} if the offeredServiceDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the offeredServiceDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<OfferedServiceDTO> updateOfferedService(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody OfferedServiceDTO offeredServiceDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update OfferedService : {}, {}", id, offeredServiceDTO);
        if (offeredServiceDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offeredServiceDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!offeredServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        offeredServiceDTO = offeredServiceService.update(offeredServiceDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, offeredServiceDTO.getId().toString()))
            .body(offeredServiceDTO);
    }

    /**
     * {@code PATCH  /offered-services/:id} : Partial updates given fields of an existing offeredService, field will ignore if it is null
     *
     * @param id                the id of the offeredServiceDTO to save.
     * @param offeredServiceDTO the offeredServiceDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offeredServiceDTO,
     * or with status {@code 400 (Bad Request)} if the offeredServiceDTO is not valid,
     * or with status {@code 404 (Not Found)} if the offeredServiceDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the offeredServiceDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = {"application/json", "application/merge-patch+json"})
    public ResponseEntity<OfferedServiceDTO> partialUpdateOfferedService(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody OfferedServiceDTO offeredServiceDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update OfferedService partially : {}, {}", id, offeredServiceDTO);
        if (offeredServiceDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offeredServiceDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!offeredServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OfferedServiceDTO> result = offeredServiceService.partialUpdate(offeredServiceDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, offeredServiceDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /offered-services} : get all the offeredServices.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of offeredServices in body.
     */
    @GetMapping("")
    public ResponseEntity<List<OfferedServiceDTO>> getAllOfferedServices(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of OfferedServices");
        Page<OfferedServiceDTO> page = offeredServiceService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /offered-services/:id} : get the "id" offeredService.
     *
     * @param id the id of the offeredServiceDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the offeredServiceDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OfferedServiceDTO> getOfferedService(@PathVariable("id") Long id) {
        LOG.debug("REST request to get OfferedService : {}", id);
        Optional<OfferedServiceDTO> offeredServiceDTO = offeredServiceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(offeredServiceDTO);
    }

    /**
     * {@code DELETE  /offered-services/:id} : delete the "id" offeredService.
     *
     * @param id the id of the offeredServiceDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOfferedService(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete OfferedService : {}", id);
        offeredServiceService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
