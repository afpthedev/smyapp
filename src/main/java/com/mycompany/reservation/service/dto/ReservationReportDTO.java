package com.mycompany.reservation.service.dto;

import com.mycompany.reservation.domain.enumeration.ReservationStatus;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.EnumMap;
import java.util.Map;

public class ReservationReportDTO implements Serializable {

    private long totalReservations;
    private long distinctCustomers;
    private long distinctBusinesses;
    private long upcomingReservations;
    private Map<ReservationStatus, Long> statusCounts = new EnumMap<>(ReservationStatus.class);
    private ZonedDateTime rangeStart;
    private ZonedDateTime rangeEnd;

    public long getTotalReservations() {
        return totalReservations;
    }

    public void setTotalReservations(long totalReservations) {
        this.totalReservations = totalReservations;
    }

    public long getDistinctCustomers() {
        return distinctCustomers;
    }

    public void setDistinctCustomers(long distinctCustomers) {
        this.distinctCustomers = distinctCustomers;
    }

    public long getDistinctBusinesses() {
        return distinctBusinesses;
    }

    public void setDistinctBusinesses(long distinctBusinesses) {
        this.distinctBusinesses = distinctBusinesses;
    }

    public long getUpcomingReservations() {
        return upcomingReservations;
    }

    public void setUpcomingReservations(long upcomingReservations) {
        this.upcomingReservations = upcomingReservations;
    }

    public Map<ReservationStatus, Long> getStatusCounts() {
        return statusCounts;
    }

    public void setStatusCounts(Map<ReservationStatus, Long> statusCounts) {
        this.statusCounts = statusCounts;
    }

    public ZonedDateTime getRangeStart() {
        return rangeStart;
    }

    public void setRangeStart(ZonedDateTime rangeStart) {
        this.rangeStart = rangeStart;
    }

    public ZonedDateTime getRangeEnd() {
        return rangeEnd;
    }

    public void setRangeEnd(ZonedDateTime rangeEnd) {
        this.rangeEnd = rangeEnd;
    }
}
