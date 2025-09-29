package com.mycompany.reservation.web.rest;

import com.mycompany.reservation.domain.FinanceDocument;
import com.mycompany.reservation.service.FinanceDocumentService;
import com.mycompany.reservation.service.dto.FinanceDocumentDTO;
import com.mycompany.reservation.web.rest.errors.BadRequestAlertException;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tech.jhipster.web.util.HeaderUtil;

/**
 * REST controller for managing {@link com.mycompany.reservation.domain.FinanceDocument}.
 */
@RestController
@RequestMapping("/api/finance-documents")
public class FinanceDocumentResource {

    private static final Logger LOG = LoggerFactory.getLogger(FinanceDocumentResource.class);

    private static final String ENTITY_NAME = "financeDocument";

    private final FinanceDocumentService financeDocumentService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public FinanceDocumentResource(FinanceDocumentService financeDocumentService) {
        this.financeDocumentService = financeDocumentService;
    }

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FinanceDocumentDTO> uploadDocument(@RequestPart("file") MultipartFile file)
        throws URISyntaxException, IOException {
        LOG.debug("REST request to upload FinanceDocument : {}", file.getOriginalFilename());
        if (file.isEmpty()) {
            throw new BadRequestAlertException("Dosya yüklenemedi", ENTITY_NAME, "fileempty");
        }

        FinanceDocumentDTO result = financeDocumentService.store(file);
        return ResponseEntity.created(new URI("/api/finance-documents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinanceDocumentDTO> getFinanceDocument(@PathVariable Long id) {
        LOG.debug("REST request to get FinanceDocument : {}", id);
        Optional<FinanceDocumentDTO> financeDocumentDTO = financeDocumentService.findOne(id);
        return financeDocumentDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<ByteArrayResource> downloadFinanceDocument(@PathVariable Long id) {
        LOG.debug("REST request to download FinanceDocument : {}", id);
        Optional<FinanceDocument> financeDocument = financeDocumentService.findEntity(id);
        if (financeDocument.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        FinanceDocument document = financeDocument.get();
        ByteArrayResource resource = new ByteArrayResource(document.getData());
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(document.getContentType()))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + document.getFileName())
            .contentLength(document.getSize())
            .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFinanceDocument(@PathVariable Long id) {
        LOG.debug("REST request to delete FinanceDocument : {}", id);
        financeDocumentService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
