package com.mycompany.reservation.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.reservation.domain.enumeration.FinanceEntryType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FinanceEntry.
 */
@Entity
@Table(name = "finance_entry")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FinanceEntry implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "entry_type", nullable = false)
    private FinanceEntryType type;

    @NotNull
    @Column(name = "amount", precision = 21, scale = 2, nullable = false)
    private BigDecimal amount;

    @Size(max = 500)
    @Column(name = "description", length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "data" }, allowSetters = true)
    private FinanceDocument document;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FinanceEntry id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getEntryDate() {
        return this.entryDate;
    }

    public FinanceEntry entryDate(LocalDate entryDate) {
        this.setEntryDate(entryDate);
        return this;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    public FinanceEntryType getType() {
        return this.type;
    }

    public FinanceEntry type(FinanceEntryType type) {
        this.setType(type);
        return this;
    }

    public void setType(FinanceEntryType type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public FinanceEntry amount(BigDecimal amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return this.description;
    }

    public FinanceEntry description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public FinanceDocument getDocument() {
        return this.document;
    }

    public void setDocument(FinanceDocument financeDocument) {
        this.document = financeDocument;
    }

    public FinanceEntry document(FinanceDocument financeDocument) {
        this.setDocument(financeDocument);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FinanceEntry)) {
            return false;
        }
        return getId() != null && getId().equals(((FinanceEntry) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FinanceEntry{" +
            "id=" + getId() +
            ", entryDate='" + getEntryDate() + "'" +
            ", type='" + getType() + "'" +
            ", amount=" + getAmount() +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
