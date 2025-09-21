package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.AppointmentType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AppointmentType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppointmentTypeRepository extends JpaRepository<AppointmentType, Long>, JpaSpecificationExecutor<AppointmentType> {}
