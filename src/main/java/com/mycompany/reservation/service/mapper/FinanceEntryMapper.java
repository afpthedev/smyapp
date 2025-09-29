package com.mycompany.reservation.service.mapper;

import com.mycompany.reservation.domain.FinanceDocument;
import com.mycompany.reservation.domain.FinanceEntry;
import com.mycompany.reservation.service.dto.FinanceDocumentDTO;
import com.mycompany.reservation.service.dto.FinanceEntryDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link com.mycompany.reservation.domain.FinanceEntry} and its DTO {@link FinanceEntryDTO}.
 */
@Mapper(componentModel = "spring", uses = { FinanceDocumentMapper.class })
public interface FinanceEntryMapper extends EntityMapper<FinanceEntryDTO, FinanceEntry> {
    @Mapping(target = "document", source = "document", qualifiedByName = "financeDocumentSummary")
    FinanceEntryDTO toDto(FinanceEntry s);

    @Named("financeDocumentSummary")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "fileName", source = "fileName")
    @Mapping(target = "contentType", source = "contentType")
    @Mapping(target = "size", source = "size")
    @Mapping(target = "uploadedAt", source = "uploadedAt")
    FinanceDocumentDTO toDtoFinanceDocumentSummary(FinanceDocument financeDocument);
}
