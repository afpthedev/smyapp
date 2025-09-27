package com.mycompany.reservation.service;

import com.mycompany.reservation.domain.Reservation;
import com.mycompany.reservation.domain.enumeration.ReservationStatus;
import java.time.ZonedDateTime;
import java.util.Collection;
import org.springframework.data.jpa.domain.Specification;

public final class ReservationSpecifications {

    private ReservationSpecifications() {}

    public static Specification<Reservation> belongsToCustomer(Long customerId) {
        return (root, query, criteriaBuilder) ->
            customerId == null ? null : criteriaBuilder.equal(root.get("customer").get("id"), customerId);
    }

    public static Specification<Reservation> belongsToUser(Long userId) {
        return (root, query, criteriaBuilder) -> userId == null ? null : criteriaBuilder.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Reservation> belongsToBusiness(Long businessId) {
        return (root, query, criteriaBuilder) ->
            businessId == null ? null : criteriaBuilder.equal(root.get("business").get("id"), businessId);
    }

    public static Specification<Reservation> hasStatus(ReservationStatus status) {
        return (root, query, criteriaBuilder) -> status == null ? null : criteriaBuilder.equal(root.get("status"), status);
    }

    public static Specification<Reservation> hasStatusIn(Collection<ReservationStatus> statuses) {
        return (root, query, criteriaBuilder) -> (statuses == null || statuses.isEmpty()) ? null : root.get("status").in(statuses);
    }

    public static Specification<Reservation> startsAfter(ZonedDateTime startDate) {
        return (root, query, criteriaBuilder) ->
            startDate == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("date"), startDate);
    }

    public static Specification<Reservation> endsBefore(ZonedDateTime endDate) {
        return (root, query, criteriaBuilder) -> endDate == null ? null : criteriaBuilder.lessThanOrEqualTo(root.get("date"), endDate);
    }
}
