package com.mycompany.reservation.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.reservation.domain.FinanceDocument} entity.
 */
public class FinanceDocumentDTO implements Serializable {

    private Long id;

    @NotNull
    private String fileName;

    @NotNull
    private String contentType;

    @NotNull
    private Long size;

    private Instant uploadedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Instant uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FinanceDocumentDTO)) {
            return false;
        }

        FinanceDocumentDTO financeDocumentDTO = (FinanceDocumentDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, financeDocumentDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FinanceDocumentDTO{" +
            "id=" + getId() +
            ", fileName='" + getFileName() + "'" +
            ", contentType='" + getContentType() + "'" +
            ", size=" + getSize() +
            ", uploadedAt='" + getUploadedAt() + "'" +
            "}";
    }
}
