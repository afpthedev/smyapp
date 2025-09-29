package com.mycompany.reservation.service;

import com.mycompany.reservation.domain.FinanceEntry;
import com.mycompany.reservation.repository.FinanceEntryRepository;
import com.mycompany.reservation.service.dto.FinanceEntryDTO;
import com.mycompany.reservation.service.mapper.FinanceEntryMapper;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.reservation.domain.FinanceEntry}.
 */
@Service
@Transactional
public class FinanceEntryService {

    private static final Logger LOG = LoggerFactory.getLogger(FinanceEntryService.class);

    private final FinanceEntryRepository financeEntryRepository;
    private final FinanceEntryMapper financeEntryMapper;

    public FinanceEntryService(FinanceEntryRepository financeEntryRepository, FinanceEntryMapper financeEntryMapper) {
        this.financeEntryRepository = financeEntryRepository;
        this.financeEntryMapper = financeEntryMapper;
    }

    public FinanceEntryDTO save(FinanceEntryDTO financeEntryDTO) {
        LOG.debug("Request to save FinanceEntry : {}", financeEntryDTO);
        FinanceEntry financeEntry = financeEntryMapper.toEntity(financeEntryDTO);
        financeEntry = financeEntryRepository.save(financeEntry);
        return financeEntryMapper.toDto(financeEntry);
    }

    public FinanceEntryDTO update(FinanceEntryDTO financeEntryDTO) {
        LOG.debug("Request to update FinanceEntry : {}", financeEntryDTO);
        FinanceEntry financeEntry = financeEntryMapper.toEntity(financeEntryDTO);
        financeEntry = financeEntryRepository.save(financeEntry);
        return financeEntryMapper.toDto(financeEntry);
    }

    public Optional<FinanceEntryDTO> partialUpdate(FinanceEntryDTO financeEntryDTO) {
        LOG.debug("Request to partially update FinanceEntry : {}", financeEntryDTO);

        return financeEntryRepository
            .findById(financeEntryDTO.getId())
            .map(existingFinanceEntry -> {
                financeEntryMapper.partialUpdate(existingFinanceEntry, financeEntryDTO);

                return existingFinanceEntry;
            })
            .map(financeEntryRepository::save)
            .map(financeEntryMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<FinanceEntryDTO> findAll() {
        LOG.debug("Request to get all FinanceEntries");
        return financeEntryRepository.findAll().stream().map(financeEntryMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public Optional<FinanceEntryDTO> findOne(Long id) {
        LOG.debug("Request to get FinanceEntry : {}", id);
        return financeEntryRepository.findById(id).map(financeEntryMapper::toDto);
    }

    public void delete(Long id) {
        LOG.debug("Request to delete FinanceEntry : {}", id);
        financeEntryRepository.deleteById(id);
    }
}
