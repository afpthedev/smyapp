package com.mycompany.reservation.service;

import com.mycompany.reservation.domain.Service;
import com.mycompany.reservation.repository.ServiceRepository;
import com.mycompany.reservation.service.dto.ServiceDTO;
import com.mycompany.reservation.service.mapper.ServiceMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.reservation.domain.Service}.
 */
@Service
@Transactional
public class ServiceService {

    private static final Logger LOG = LoggerFactory.getLogger(ServiceService.class);

    private final ServiceRepository serviceRepository;

    private final ServiceMapper serviceMapper;

    public ServiceService(ServiceRepository serviceRepository, ServiceMapper serviceMapper) {
        this.serviceRepository = serviceRepository;
        this.serviceMapper = serviceMapper;
    }

    /**
     * Save a service.
     *
     * @param serviceDTO the entity to save.
     * @return the persisted entity.
     */
    public ServiceDTO save(ServiceDTO serviceDTO) {
        LOG.debug("Request to save Service : {}", serviceDTO);
        Service service = serviceMapper.toEntity(serviceDTO);
        service = serviceRepository.save(service);
        return serviceMapper.toDto(service);
    }

    /**
     * Update a service.
     *
     * @param serviceDTO the entity to save.
     * @return the persisted entity.
     */
    public ServiceDTO update(ServiceDTO serviceDTO) {
        LOG.debug("Request to update Service : {}", serviceDTO);
        Service service = serviceMapper.toEntity(serviceDTO);
        service = serviceRepository.save(service);
        return serviceMapper.toDto(service);
    }

    /**
     * Partially update a service.
     *
     * @param serviceDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ServiceDTO> partialUpdate(ServiceDTO serviceDTO) {
        LOG.debug("Request to partially update Service : {}", serviceDTO);

        return serviceRepository
            .findById(serviceDTO.getId())
            .map(existingService -> {
                serviceMapper.partialUpdate(existingService, serviceDTO);

                return existingService;
            })
            .map(serviceRepository::save)
            .map(serviceMapper::toDto);
    }

    /**
     * Get all the services.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ServiceDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Services");
        return serviceRepository.findAll(pageable).map(serviceMapper::toDto);
    }

    /**
     * Get one service by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ServiceDTO> findOne(Long id) {
        LOG.debug("Request to get Service : {}", id);
        return serviceRepository.findById(id).map(serviceMapper::toDto);
    }

    /**
     * Delete the service by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Service : {}", id);
        serviceRepository.deleteById(id);
    }
}
