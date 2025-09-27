package com.mycompany.reservation.service.dto;

import com.mycompany.reservation.domain.enumeration.ReservationStatus;
import java.io.Serializable;
import java.time.ZonedDateTime;

public class ReservationFilterCriteria implements Serializable {

    private Long customerId;
    private Long businessId;
    private ReservationStatus status;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getBusinessId() {
        return businessId;
    }

    public void setBusinessId(Long businessId) {
        this.businessId = businessId;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public ZonedDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(ZonedDateTime startDate) {
        this.startDate = startDate;
    }

    public ZonedDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(ZonedDateTime endDate) {
        this.endDate = endDate;
    }
}
