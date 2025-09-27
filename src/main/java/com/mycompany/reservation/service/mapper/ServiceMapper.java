package com.mycompany.reservation.service.mapper;

import com.mycompany.reservation.domain.Business;
import com.mycompany.reservation.domain.Service;
import com.mycompany.reservation.service.dto.BusinessDTO;
import com.mycompany.reservation.service.dto.ServiceDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Service} and its DTO {@link ServiceDTO}.
 */
@Mapper(componentModel = "spring")
public interface ServiceMapper extends EntityMapper<ServiceDTO, Service> {
    @Mapping(target = "business", source = "business", qualifiedByName = "businessId")
    ServiceDTO toDto(Service s);

    @Named("businessId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    BusinessDTO toDtoBusinessId(Business business);
}
