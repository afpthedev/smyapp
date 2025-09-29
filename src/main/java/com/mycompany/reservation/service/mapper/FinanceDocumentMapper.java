package com.mycompany.reservation.service.mapper;

import com.mycompany.reservation.domain.FinanceDocument;
import com.mycompany.reservation.service.dto.FinanceDocumentDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity {@link com.mycompany.reservation.domain.FinanceDocument} and its DTO {@link FinanceDocumentDTO}.
 */
@Mapper(componentModel = "spring")
public interface FinanceDocumentMapper extends EntityMapper<FinanceDocumentDTO, FinanceDocument> {}
