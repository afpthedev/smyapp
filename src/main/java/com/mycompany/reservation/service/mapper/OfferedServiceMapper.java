package com.mycompany.reservation.service.mapper;

import com.mycompany.reservation.domain.Business;
import com.mycompany.reservation.domain.OfferedService;
import com.mycompany.reservation.service.dto.BusinessDTO;
import com.mycompany.reservation.service.dto.OfferedServiceDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link OfferedService} and its DTO {@link OfferedServiceDTO}.
 */
@Mapper(componentModel = "spring")
public interface OfferedServiceMapper extends EntityMapper<OfferedServiceDTO, OfferedService> {
    @Mapping(target = "business", source = "business", qualifiedByName = "businessId")
    OfferedServiceDTO toDto(OfferedService s);

    @Named("businessId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    BusinessDTO toDtoBusinessId(Business business);
}
