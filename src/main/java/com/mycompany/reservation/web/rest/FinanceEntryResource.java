package com.mycompany.reservation.web.rest;

import com.mycompany.reservation.repository.FinanceEntryRepository;
import com.mycompany.reservation.service.FinanceEntryService;
import com.mycompany.reservation.service.dto.FinanceEntryDTO;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.reservation.domain.FinanceEntry}.
 */
@RestController
@RequestMapping("/api/finance-entries")
public class FinanceEntryResource {

    private static final Logger LOG = LoggerFactory.getLogger(FinanceEntryResource.class);

    private static final String ENTITY_NAME = "financeEntry";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FinanceEntryService financeEntryService;
    private final FinanceEntryRepository financeEntryRepository;

    public FinanceEntryResource(FinanceEntryService financeEntryService, FinanceEntryRepository financeEntryRepository) {
        this.financeEntryService = financeEntryService;
        this.financeEntryRepository = financeEntryRepository;
    }

    @PostMapping("")
    public ResponseEntity<FinanceEntryDTO> createFinanceEntry(@Valid @RequestBody FinanceEntryDTO financeEntryDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save FinanceEntry : {}", financeEntryDTO);
        if (financeEntryDTO.getId() != null) {
            throw new BadRequestAlertException("A new financeEntry cannot already have an ID", ENTITY_NAME, "idexists");
        }
        financeEntryDTO = financeEntryService.save(financeEntryDTO);
        return ResponseEntity.created(new URI("/api/finance-entries/" + financeEntryDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, financeEntryDTO.getId().toString()))
            .body(financeEntryDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FinanceEntryDTO> updateFinanceEntry(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FinanceEntryDTO financeEntryDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update FinanceEntry : {}, {}", id, financeEntryDTO);
        if (financeEntryDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, financeEntryDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!financeEntryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        financeEntryDTO = financeEntryService.update(financeEntryDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, financeEntryDTO.getId().toString()))
            .body(financeEntryDTO);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FinanceEntryDTO> partialUpdateFinanceEntry(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FinanceEntryDTO financeEntryDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update FinanceEntry partially : {}, {}", id, financeEntryDTO);
        if (financeEntryDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, financeEntryDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!financeEntryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FinanceEntryDTO> result = financeEntryService.partialUpdate(financeEntryDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, financeEntryDTO.getId().toString())
        );
    }

    @GetMapping("")
    public List<FinanceEntryDTO> getAllFinanceEntries() {
        LOG.debug("REST request to get all FinanceEntries");
        return financeEntryService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinanceEntryDTO> getFinanceEntry(@PathVariable Long id) {
        LOG.debug("REST request to get FinanceEntry : {}", id);
        Optional<FinanceEntryDTO> financeEntryDTO = financeEntryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(financeEntryDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFinanceEntry(@PathVariable Long id) {
        LOG.debug("REST request to delete FinanceEntry : {}", id);
        financeEntryService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
