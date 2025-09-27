package com.mycompany.reservation.service;

import com.mycompany.reservation.domain.OfferedService;
import com.mycompany.reservation.repository.OfferedServiceRepository;
import com.mycompany.reservation.service.dto.OfferedServiceDTO;
import com.mycompany.reservation.service.mapper.OfferedServiceMapper;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.reservation.domain.OfferedService}.
 */
@Service
@Transactional
public class OfferedServiceService {

    private static final Logger LOG = LoggerFactory.getLogger(OfferedServiceService.class);

    private final OfferedServiceRepository offeredServiceRepository;

    private final OfferedServiceMapper offeredServiceMapper;

    public OfferedServiceService(OfferedServiceRepository offeredServiceRepository, OfferedServiceMapper offeredServiceMapper) {
        this.offeredServiceRepository = offeredServiceRepository;
        this.offeredServiceMapper = offeredServiceMapper;
    }

    /**
     * Save a offeredService.
     *
     * @param offeredServiceDTO the entity to save.
     * @return the persisted entity.
     */
    public OfferedServiceDTO save(OfferedServiceDTO offeredServiceDTO) {
        LOG.debug("Request to save OfferedService : {}", offeredServiceDTO);
        OfferedService offeredService = offeredServiceMapper.toEntity(offeredServiceDTO);
        offeredService = offeredServiceRepository.save(offeredService);
        return offeredServiceMapper.toDto(offeredService);
    }

    /**
     * Update a offeredService.
     *
     * @param offeredServiceDTO the entity to save.
     * @return the persisted entity.
     */
    public OfferedServiceDTO update(OfferedServiceDTO offeredServiceDTO) {
        LOG.debug("Request to update OfferedService : {}", offeredServiceDTO);
        OfferedService offeredService = offeredServiceMapper.toEntity(offeredServiceDTO);
        offeredService = offeredServiceRepository.save(offeredService);
        return offeredServiceMapper.toDto(offeredService);
    }

    /**
     * Partially update a offeredService.
     *
     * @param offeredServiceDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<OfferedServiceDTO> partialUpdate(OfferedServiceDTO offeredServiceDTO) {
        LOG.debug("Request to partially update OfferedService : {}", offeredServiceDTO);

        return offeredServiceRepository
            .findById(offeredServiceDTO.getId())
            .map(existingOfferedService -> {
                offeredServiceMapper.partialUpdate(existingOfferedService, offeredServiceDTO);

                return existingOfferedService;
            })
            .map(offeredServiceRepository::save)
            .map(offeredServiceMapper::toDto);
    }

    /**
     * Get all the offeredServices.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<OfferedServiceDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all OfferedServices");
        return offeredServiceRepository.findAll(pageable).map(offeredServiceMapper::toDto);
    }

    /**
     * Get one offeredService by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<OfferedServiceDTO> findOne(Long id) {
        LOG.debug("Request to get OfferedService : {}", id);
        return offeredServiceRepository.findById(id).map(offeredServiceMapper::toDto);
    }

    /**
     * Delete the offeredService by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete OfferedService : {}", id);
        offeredServiceRepository.deleteById(id);
    }
}
