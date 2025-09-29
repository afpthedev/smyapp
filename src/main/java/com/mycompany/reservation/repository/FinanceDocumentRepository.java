package com.mycompany.reservation.repository;

import com.mycompany.reservation.domain.FinanceDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the FinanceDocument entity.
 */
@Repository
public interface FinanceDocumentRepository extends JpaRepository<FinanceDocument, Long> {}
