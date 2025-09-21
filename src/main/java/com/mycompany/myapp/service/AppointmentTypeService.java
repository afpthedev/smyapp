package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.AppointmentTypeDTO;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.AppointmentType}.
 */
public interface AppointmentTypeService {
    /**
     * Save a appointmentType.
     *
     * @param appointmentTypeDTO the entity to save.
     * @return the persisted entity.
     */
    AppointmentTypeDTO save(AppointmentTypeDTO appointmentTypeDTO);

    /**
     * Updates a appointmentType.
     *
     * @param appointmentTypeDTO the entity to update.
     * @return the persisted entity.
     */
    AppointmentTypeDTO update(AppointmentTypeDTO appointmentTypeDTO);

    /**
     * Partially updates a appointmentType.
     *
     * @param appointmentTypeDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AppointmentTypeDTO> partialUpdate(AppointmentTypeDTO appointmentTypeDTO);

    /**
     * Get the "id" appointmentType.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AppointmentTypeDTO> findOne(Long id);

    /**
     * Delete the "id" appointmentType.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
