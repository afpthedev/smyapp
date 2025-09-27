package com.mycompany.reservation.service.dto;

import com.mycompany.reservation.domain.enumeration.ReservationStatus;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.reservation.domain.Reservation} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ReservationDTO implements Serializable {

    private Long id;

    @NotNull
    private ZonedDateTime date;

    @NotNull
    private ReservationStatus status;

    private String notes;

    private OfferedServiceDTO service;

    private CustomerDTO customer;

    private BusinessDTO business;

    private Long userId;

    private String userLogin;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return date;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public OfferedServiceDTO getService() {
        return service;
    }

    public void setService(OfferedServiceDTO service) {
        this.service = service;
    }

    public CustomerDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerDTO customer) {
        this.customer = customer;
    }

    public BusinessDTO getBusiness() {
        return business;
    }

    public void setBusiness(BusinessDTO business) {
        this.business = business;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(String userLogin) {
        this.userLogin = userLogin;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ReservationDTO)) {
            return false;
        }

        ReservationDTO reservationDTO = (ReservationDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, reservationDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReservationDTO{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", notes='" + getNotes() + "'" +
            ", service=" + getService() +
            ", customer=" + getCustomer() +
            ", business=" + getBusiness() +
            ", userId=" + getUserId() +
            ", userLogin='" + getUserLogin() + "'" +
            "}";
    }
}
