package com.mycompany.reservation.service;

import com.mycompany.reservation.domain.FinanceDocument;
import com.mycompany.reservation.repository.FinanceDocumentRepository;
import com.mycompany.reservation.service.dto.FinanceDocumentDTO;
import com.mycompany.reservation.service.mapper.FinanceDocumentMapper;
import java.io.IOException;
import java.time.Instant;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service Implementation for managing {@link com.mycompany.reservation.domain.FinanceDocument}.
 */
@Service
@Transactional
public class FinanceDocumentService {

    private static final Logger LOG = LoggerFactory.getLogger(FinanceDocumentService.class);

    private final FinanceDocumentRepository financeDocumentRepository;
    private final FinanceDocumentMapper financeDocumentMapper;

    public FinanceDocumentService(FinanceDocumentRepository financeDocumentRepository, FinanceDocumentMapper financeDocumentMapper) {
        this.financeDocumentRepository = financeDocumentRepository;
        this.financeDocumentMapper = financeDocumentMapper;
    }

    public FinanceDocumentDTO store(MultipartFile file) throws IOException {
        LOG.debug("Request to store FinanceDocument : {}", file.getOriginalFilename());
        FinanceDocument financeDocument = new FinanceDocument()
            .fileName(file.getOriginalFilename() != null ? file.getOriginalFilename() : "invoice")
            .contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
            .size(file.getSize())
            .uploadedAt(Instant.now())
            .data(file.getBytes());

        financeDocument = financeDocumentRepository.save(financeDocument);
        return financeDocumentMapper.toDto(financeDocument);
    }

    @Transactional(readOnly = true)
    public Optional<FinanceDocumentDTO> findOne(Long id) {
        LOG.debug("Request to get FinanceDocument : {}", id);
        return financeDocumentRepository.findById(id).map(financeDocumentMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Optional<FinanceDocument> findEntity(Long id) {
        LOG.debug("Request to get FinanceDocument entity : {}", id);
        return financeDocumentRepository.findById(id);
    }

    public void delete(Long id) {
        LOG.debug("Request to delete FinanceDocument : {}", id);
        financeDocumentRepository.deleteById(id);
    }
}
