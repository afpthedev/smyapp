package com.mycompany.reservation.repository;

import com.mycompany.reservation.domain.Reservation;
import com.mycompany.reservation.domain.enumeration.ReservationStatus;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Reservation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long>, JpaSpecificationExecutor<Reservation> {
    Page<Reservation> findAllByCustomerId(Long customerId, Pageable pageable);

    long countByCustomerId(Long customerId);

    long countByCustomerIdAndDateAfter(Long customerId, ZonedDateTime date);

    Optional<Reservation> findFirstByCustomerIdOrderByDateDesc(Long customerId);

    Optional<Reservation> findFirstByCustomerIdAndDateAfterOrderByDateAsc(Long customerId, ZonedDateTime date);

    Page<Reservation> findAllByUserLogin(String login, Pageable pageable);

    @Query("select r.status as status, count(r) as total from Reservation r where r.customer.id = :customerId group by r.status")
    List<StatusCountProjection> countByCustomerGroupedByStatus(@Param("customerId") Long customerId);

    @Query(
        """
            select r.status as status, count(r) as total
            from Reservation r
            where (:customerId is null or r.customer.id = :customerId)
              and (:businessId is null or r.business.id = :businessId)
              and (:status is null or r.status = :status)
              and (:startDate is null or r.date >= :startDate)
              and (:endDate is null or r.date <= :endDate)
            group by r.status
        """
    )
    List<StatusCountProjection> countByFilters(
        @Param("customerId") Long customerId,
        @Param("businessId") Long businessId,
        @Param("status") ReservationStatus status,
        @Param("startDate") ZonedDateTime startDate,
        @Param("endDate") ZonedDateTime endDate
    );

    @Query(
        """
            select count(distinct r.customer.id)
            from Reservation r
            where (:businessId is null or r.business.id = :businessId)
              and (:startDate is null or r.date >= :startDate)
              and (:endDate is null or r.date <= :endDate)
        """
    )
    long countDistinctCustomersByFilters(
        @Param("businessId") Long businessId,
        @Param("startDate") ZonedDateTime startDate,
        @Param("endDate") ZonedDateTime endDate
    );

    @Query(
        """
            select count(distinct r.business.id)
            from Reservation r
            where (:customerId is null or r.customer.id = :customerId)
              and (:startDate is null or r.date >= :startDate)
              and (:endDate is null or r.date <= :endDate)
        """
    )
    long countDistinctBusinessesByFilters(
        @Param("customerId") Long customerId,
        @Param("startDate") ZonedDateTime startDate,
        @Param("endDate") ZonedDateTime endDate
    );

    interface StatusCountProjection {
        ReservationStatus getStatus();

        long getTotal();
    }
}
