package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.AppointmentType;
import com.mycompany.myapp.repository.AppointmentTypeRepository;
import com.mycompany.myapp.service.AppointmentTypeService;
import com.mycompany.myapp.service.dto.AppointmentTypeDTO;
import com.mycompany.myapp.service.mapper.AppointmentTypeMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.AppointmentType}.
 */
@Service
@Transactional
public class AppointmentTypeServiceImpl implements AppointmentTypeService {

    private static final Logger LOG = LoggerFactory.getLogger(AppointmentTypeServiceImpl.class);

    private final AppointmentTypeRepository appointmentTypeRepository;

    private final AppointmentTypeMapper appointmentTypeMapper;

    public AppointmentTypeServiceImpl(AppointmentTypeRepository appointmentTypeRepository, AppointmentTypeMapper appointmentTypeMapper) {
        this.appointmentTypeRepository = appointmentTypeRepository;
        this.appointmentTypeMapper = appointmentTypeMapper;
    }

    @Override
    public AppointmentTypeDTO save(AppointmentTypeDTO appointmentTypeDTO) {
        LOG.debug("Request to save AppointmentType : {}", appointmentTypeDTO);
        AppointmentType appointmentType = appointmentTypeMapper.toEntity(appointmentTypeDTO);
        appointmentType = appointmentTypeRepository.save(appointmentType);
        return appointmentTypeMapper.toDto(appointmentType);
    }

    @Override
    public AppointmentTypeDTO update(AppointmentTypeDTO appointmentTypeDTO) {
        LOG.debug("Request to update AppointmentType : {}", appointmentTypeDTO);
        AppointmentType appointmentType = appointmentTypeMapper.toEntity(appointmentTypeDTO);
        appointmentType = appointmentTypeRepository.save(appointmentType);
        return appointmentTypeMapper.toDto(appointmentType);
    }

    @Override
    public Optional<AppointmentTypeDTO> partialUpdate(AppointmentTypeDTO appointmentTypeDTO) {
        LOG.debug("Request to partially update AppointmentType : {}", appointmentTypeDTO);

        return appointmentTypeRepository
            .findById(appointmentTypeDTO.getId())
            .map(existingAppointmentType -> {
                appointmentTypeMapper.partialUpdate(existingAppointmentType, appointmentTypeDTO);

                return existingAppointmentType;
            })
            .map(appointmentTypeRepository::save)
            .map(appointmentTypeMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AppointmentTypeDTO> findOne(Long id) {
        LOG.debug("Request to get AppointmentType : {}", id);
        return appointmentTypeRepository.findById(id).map(appointmentTypeMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete AppointmentType : {}", id);
        appointmentTypeRepository.deleteById(id);
    }
}
