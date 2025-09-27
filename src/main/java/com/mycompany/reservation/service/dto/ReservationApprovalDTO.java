package com.mycompany.reservation.service.dto;

import java.io.Serializable;

/**
 * Payload used when approving an existing reservation.
 */
public class ReservationApprovalDTO implements Serializable {

    private String notes;

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
