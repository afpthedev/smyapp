package com.mycompany.reservation.service.mapper;

import com.mycompany.reservation.domain.Business;
import com.mycompany.reservation.service.dto.BusinessDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Business} and its DTO {@link BusinessDTO}.
 */
@Mapper(componentModel = "spring")
public interface BusinessMapper extends EntityMapper<BusinessDTO, Business> {}
