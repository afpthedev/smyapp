package com.mycompany.reservation.service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * Payload for unauthenticated reservation submissions.
 */
public class GuestReservationRequest implements Serializable {

    @NotBlank
    @Size(max = 80)
    private String firstName;

    @NotBlank
    @Size(max = 80)
    private String lastName;

    @NotBlank
    @Email
    @Size(max = 191)
    private String email;

    @NotBlank
    @Size(max = 40)
    private String phone;

    @NotNull
    private ZonedDateTime reservationDate;

    @Size(max = 2000)
    private String notes;

    private Long offeredServiceId;

    private Long businessId;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public ZonedDateTime getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(ZonedDateTime reservationDate) {
        this.reservationDate = reservationDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getOfferedServiceId() {
        return offeredServiceId;
    }

    public void setOfferedServiceId(Long offeredServiceId) {
        this.offeredServiceId = offeredServiceId;
    }

    public Long getBusinessId() {
        return businessId;
    }

    public void setBusinessId(Long businessId) {
        this.businessId = businessId;
    }
}
