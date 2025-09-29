package com.mycompany.reservation.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FinanceDocument.
 */
@Entity
@Table(name = "finance_document")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FinanceDocument implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "file_name", nullable = false)
    private String fileName;

    @NotNull
    @Column(name = "content_type", nullable = false)
    private String contentType;

    @NotNull
    @Column(name = "file_size", nullable = false)
    private Long size;

    @NotNull
    @Lob
    @JsonIgnore
    @Column(name = "data", nullable = false)
    private byte[] data;

    @Column(name = "uploaded_at")
    private Instant uploadedAt;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FinanceDocument id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return this.fileName;
    }

    public FinanceDocument fileName(String fileName) {
        this.setFileName(fileName);
        return this;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getContentType() {
        return this.contentType;
    }

    public FinanceDocument contentType(String contentType) {
        this.setContentType(contentType);
        return this;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getSize() {
        return this.size;
    }

    public FinanceDocument size(Long size) {
        this.setSize(size);
        return this;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public byte[] getData() {
        return this.data;
    }

    public FinanceDocument data(byte[] data) {
        this.setData(data);
        return this;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public Instant getUploadedAt() {
        return this.uploadedAt;
    }

    public FinanceDocument uploadedAt(Instant uploadedAt) {
        this.setUploadedAt(uploadedAt);
        return this;
    }

    public void setUploadedAt(Instant uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FinanceDocument)) {
            return false;
        }
        return getId() != null && getId().equals(((FinanceDocument) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FinanceDocument{" +
            "id=" + getId() +
            ", fileName='" + getFileName() + "'" +
            ", contentType='" + getContentType() + "'" +
            ", size=" + getSize() +
            ", uploadedAt='" + getUploadedAt() + "'" +
            "}";
    }
}
