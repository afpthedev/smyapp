package com.mycompany.reservation.web.rest;

import com.mycompany.reservation.domain.enumeration.ReservationStatus;
import com.mycompany.reservation.repository.ReservationRepository;
import com.mycompany.reservation.security.AuthoritiesConstants;
import com.mycompany.reservation.service.ReservationService;
import com.mycompany.reservation.service.dto.ReservationDTO;
import com.mycompany.reservation.service.dto.ReservationFilterCriteria;
import com.mycompany.reservation.service.dto.ReservationReportDTO;
import com.mycompany.reservation.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.reservation.domain.Reservation}.
 */
@RestController
@RequestMapping("/api/reservations")
public class ReservationResource {

    private static final Logger LOG = LoggerFactory.getLogger(ReservationResource.class);

    private static final String ENTITY_NAME = "reservation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReservationService reservationService;

    private final ReservationRepository reservationRepository;

    public ReservationResource(ReservationService reservationService, ReservationRepository reservationRepository) {
        this.reservationService = reservationService;
        this.reservationRepository = reservationRepository;
    }

    /**
     * {@code POST  /reservations} : Create a new reservation.
     *
     * @param reservationDTO the reservationDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reservationDTO, or with status {@code 400 (Bad Request)} if the reservation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ReservationDTO> createReservation(@Valid @RequestBody ReservationDTO reservationDTO) throws URISyntaxException {
        LOG.debug("REST request to save Reservation : {}", reservationDTO);
        if (reservationDTO.getId() != null) {
            throw new BadRequestAlertException("A new reservation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        reservationDTO = reservationService.save(reservationDTO);
        return ResponseEntity.created(new URI("/api/reservations/" + reservationDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, reservationDTO.getId().toString()))
            .body(reservationDTO);
    }

    /**
     * {@code PUT  /reservations/:id} : Updates an existing reservation.
     *
     * @param id             the id of the reservationDTO to save.
     * @param reservationDTO the reservationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reservationDTO,
     * or with status {@code 400 (Bad Request)} if the reservationDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reservationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReservationDTO> updateReservation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ReservationDTO reservationDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Reservation : {}, {}", id, reservationDTO);
        if (reservationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reservationDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reservationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        reservationDTO = reservationService.update(reservationDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reservationDTO.getId().toString()))
            .body(reservationDTO);
    }

    /**
     * {@code PATCH  /reservations/:id} : Partial updates given fields of an existing reservation, field will ignore if it is null
     *
     * @param id             the id of the reservationDTO to save.
     * @param reservationDTO the reservationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reservationDTO,
     * or with status {@code 400 (Bad Request)} if the reservationDTO is not valid,
     * or with status {@code 404 (Not Found)} if the reservationDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the reservationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ReservationDTO> partialUpdateReservation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ReservationDTO reservationDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Reservation partially : {}, {}", id, reservationDTO);
        if (reservationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reservationDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reservationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ReservationDTO> result = reservationService.partialUpdate(reservationDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reservationDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /reservations} : get all the reservations.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reservations in body.
     */
    @GetMapping("")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    public ResponseEntity<List<ReservationDTO>> getAllReservations(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Reservations");
        Page<ReservationDTO> page = reservationService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReservationDTO>> getCurrentUserReservations(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(value = "status", required = false) ReservationStatus status,
        @RequestParam(value = "businessId", required = false) Long businessId,
        @RequestParam(value = "start", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime start,
        @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime end
    ) {
        LOG.debug("REST request to get reservations for current user");
        ReservationFilterCriteria criteria = new ReservationFilterCriteria();
        criteria.setStatus(status);
        criteria.setBusinessId(businessId);
        criteria.setStartDate(start);
        criteria.setEndDate(end);
        Page<ReservationDTO> page = reservationService.findForCurrentUser(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/report")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    public ResponseEntity<ReservationReportDTO> getReservationReport(
        @RequestParam(value = "customerId", required = false) Long customerId,
        @RequestParam(value = "businessId", required = false) Long businessId,
        @RequestParam(value = "status", required = false) ReservationStatus status,
        @RequestParam(value = "start", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime start,
        @RequestParam(value = "end", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime end
    ) {
        LOG.debug("REST request for reservation report");
        ReservationFilterCriteria criteria = new ReservationFilterCriteria();
        criteria.setCustomerId(customerId);
        criteria.setBusinessId(businessId);
        criteria.setStatus(status);
        criteria.setStartDate(start);
        criteria.setEndDate(end);
        ReservationReportDTO report = reservationService.getReservationReport(criteria);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/upcoming")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    public ResponseEntity<List<ReservationDTO>> getUpcomingReservations(@RequestParam(value = "size", defaultValue = "5") int size) {
        LOG.debug("REST request for upcoming reservations with size {}", size);
        Page<ReservationDTO> page = reservationService.findUpcoming(size);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /reservations/:id} : get the "id" reservation.
     *
     * @param id the id of the reservationDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reservationDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReservationDTO> getReservation(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Reservation : {}", id);
        Optional<ReservationDTO> reservationDTO = reservationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(reservationDTO);
    }

    /**
     * {@code DELETE  /reservations/:id} : delete the "id" reservation.
     *
     * @param id the id of the reservationDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Reservation : {}", id);
        reservationService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
