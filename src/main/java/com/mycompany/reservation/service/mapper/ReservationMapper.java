package com.mycompany.reservation.service.mapper;

import com.mycompany.reservation.domain.Business;
import com.mycompany.reservation.domain.Customer;
import com.mycompany.reservation.domain.Reservation;
import com.mycompany.reservation.domain.Service;
import com.mycompany.reservation.service.dto.BusinessDTO;
import com.mycompany.reservation.service.dto.CustomerDTO;
import com.mycompany.reservation.service.dto.ReservationDTO;
import com.mycompany.reservation.service.dto.ServiceDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Reservation} and its DTO {@link ReservationDTO}.
 */
@Mapper(componentModel = "spring")
public interface ReservationMapper extends EntityMapper<ReservationDTO, Reservation> {
    @Mapping(target = "service", source = "service", qualifiedByName = "serviceId")
    @Mapping(target = "customer", source = "customer", qualifiedByName = "customerId")
    @Mapping(target = "business", source = "business", qualifiedByName = "businessId")
    ReservationDTO toDto(Reservation s);

    @Named("serviceId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ServiceDTO toDtoServiceId(Service service);

    @Named("customerId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CustomerDTO toDtoCustomerId(Customer customer);

    @Named("businessId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    BusinessDTO toDtoBusinessId(Business business);
}
