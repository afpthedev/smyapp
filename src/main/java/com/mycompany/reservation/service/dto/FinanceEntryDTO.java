package com.mycompany.reservation.service.dto;

import com.mycompany.reservation.domain.enumeration.FinanceEntryType;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.reservation.domain.FinanceEntry} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FinanceEntryDTO implements Serializable {

    private Long id;

    @NotNull
    private LocalDate entryDate;

    @NotNull
    private FinanceEntryType type;

    @NotNull
    private BigDecimal amount;

    @Size(max = 500)
    private String description;

    private FinanceDocumentDTO document;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    public FinanceEntryType getType() {
        return type;
    }

    public void setType(FinanceEntryType type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public FinanceDocumentDTO getDocument() {
        return document;
    }

    public void setDocument(FinanceDocumentDTO document) {
        this.document = document;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FinanceEntryDTO)) {
            return false;
        }

        FinanceEntryDTO financeEntryDTO = (FinanceEntryDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, financeEntryDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FinanceEntryDTO{" +
            "id=" + getId() +
            ", entryDate='" + getEntryDate() + "'" +
            ", type='" + getType() + "'" +
            ", amount=" + getAmount() +
            ", description='" + getDescription() + "'" +
            ", document=" + getDocument() +
            "}";
    }
}
