package com.mycompany.reservation.repository;

import com.mycompany.reservation.domain.FinanceEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the FinanceEntry entity.
 */
@Repository
public interface FinanceEntryRepository extends JpaRepository<FinanceEntry, Long> {}
