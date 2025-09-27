package com.mycompany.reservation.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;

public class CustomerReservationSummaryDTO implements Serializable {

    private Long customerId;
    private String customerFullName;
    private long totalReservations;
    private long upcomingReservations;
    private long pendingReservations;
    private long confirmedReservations;
    private long completedReservations;
    private long cancelledReservations;
    private ZonedDateTime lastReservationDate;
    private ZonedDateTime nextReservationDate;

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerFullName() {
        return customerFullName;
    }

    public void setCustomerFullName(String customerFullName) {
        this.customerFullName = customerFullName;
    }

    public long getTotalReservations() {
        return totalReservations;
    }

    public void setTotalReservations(long totalReservations) {
        this.totalReservations = totalReservations;
    }

    public long getUpcomingReservations() {
        return upcomingReservations;
    }

    public void setUpcomingReservations(long upcomingReservations) {
        this.upcomingReservations = upcomingReservations;
    }

    public long getPendingReservations() {
        return pendingReservations;
    }

    public void setPendingReservations(long pendingReservations) {
        this.pendingReservations = pendingReservations;
    }

    public long getConfirmedReservations() {
        return confirmedReservations;
    }

    public void setConfirmedReservations(long confirmedReservations) {
        this.confirmedReservations = confirmedReservations;
    }

    public long getCompletedReservations() {
        return completedReservations;
    }

    public void setCompletedReservations(long completedReservations) {
        this.completedReservations = completedReservations;
    }

    public long getCancelledReservations() {
        return cancelledReservations;
    }

    public void setCancelledReservations(long cancelledReservations) {
        this.cancelledReservations = cancelledReservations;
    }

    public ZonedDateTime getLastReservationDate() {
        return lastReservationDate;
    }

    public void setLastReservationDate(ZonedDateTime lastReservationDate) {
        this.lastReservationDate = lastReservationDate;
    }

    public ZonedDateTime getNextReservationDate() {
        return nextReservationDate;
    }

    public void setNextReservationDate(ZonedDateTime nextReservationDate) {
        this.nextReservationDate = nextReservationDate;
    }
}
