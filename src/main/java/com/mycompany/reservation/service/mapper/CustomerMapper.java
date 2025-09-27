package com.mycompany.reservation.service.mapper;

import com.mycompany.reservation.domain.Business;
import com.mycompany.reservation.domain.Customer;
import com.mycompany.reservation.service.dto.BusinessDTO;
import com.mycompany.reservation.service.dto.CustomerDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Customer} and its DTO {@link CustomerDTO}.
 */
@Mapper(componentModel = "spring")
public interface CustomerMapper extends EntityMapper<CustomerDTO, Customer> {
    @Mapping(target = "business", source = "business", qualifiedByName = "businessId")
    CustomerDTO toDto(Customer s);

    @Named("businessId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    BusinessDTO toDtoBusinessId(Business business);
}
