package com.mycompany.reservation.service.mapper;

import com.mycompany.reservation.domain.Business;
import com.mycompany.reservation.domain.Customer;
import com.mycompany.reservation.domain.OfferedService;
import com.mycompany.reservation.domain.Reservation;
import com.mycompany.reservation.service.dto.BusinessDTO;
import com.mycompany.reservation.service.dto.CustomerDTO;
import com.mycompany.reservation.service.dto.OfferedServiceDTO;
import com.mycompany.reservation.service.dto.ReservationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Reservation} and its DTO {@link ReservationDTO}.
 */
@Mapper(componentModel = "spring")
public interface ReservationMapper extends EntityMapper<ReservationDTO, Reservation> {
    @Mapping(target = "service", source = "service", qualifiedByName = "offeredServiceId")
    @Mapping(target = "customer", source = "customer", qualifiedByName = "customerId")
    @Mapping(target = "business", source = "business", qualifiedByName = "businessId")
    ReservationDTO toDto(Reservation s);

    @Named("offeredServiceId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    OfferedServiceDTO toDtoOfferedServiceId(OfferedService offeredService);

    @Named("customerId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CustomerDTO toDtoCustomerId(Customer customer);

    @Named("businessId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    BusinessDTO toDtoBusinessId(Business business);
}
