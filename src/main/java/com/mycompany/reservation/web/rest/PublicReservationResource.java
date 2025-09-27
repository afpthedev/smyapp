package com.mycompany.reservation.web.rest;

import com.mycompany.reservation.service.GuestReservationService;
import com.mycompany.reservation.service.dto.GuestReservationRequest;
import com.mycompany.reservation.service.dto.ReservationDTO;
import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.HeaderUtil;

/**
 * Public entry points for reservation creation. These endpoints are intentionally unauthenticated so guests can reserve slots.
 */
@RestController
@RequestMapping("/api/public")
public class PublicReservationResource {

    private static final Logger LOG = LoggerFactory.getLogger(PublicReservationResource.class);
    private static final String ENTITY_NAME = "reservation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GuestReservationService guestReservationService;

    public PublicReservationResource(GuestReservationService guestReservationService) {
        this.guestReservationService = guestReservationService;
    }

    @PostMapping("/reservations")
    public ResponseEntity<ReservationDTO> createReservation(@Valid @RequestBody GuestReservationRequest request) throws URISyntaxException {
        LOG.debug("REST request to create public reservation");
        ReservationDTO reservation = guestReservationService.createReservation(request);
        return ResponseEntity.created(new URI("/api/reservations/" + reservation.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, reservation.getId().toString()))
            .body(reservation);
    }
}
