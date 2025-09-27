package com.mycompany.reservation.repository;

import com.mycompany.reservation.domain.OfferedService;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the OfferedService entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OfferedServiceRepository extends JpaRepository<OfferedService, Long> {
}
