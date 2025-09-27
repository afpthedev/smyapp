package com.mycompany.reservation.service.mapper;

import com.mycompany.reservation.domain.Business;
import com.mycompany.reservation.domain.Customer;
import com.mycompany.reservation.domain.OfferedService;
import com.mycompany.reservation.domain.Reservation;
import com.mycompany.reservation.domain.User;
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
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userLogin", source = "user.login")
    ReservationDTO toDto(Reservation s);

    @Mapping(target = "user", source = "userId")
    Reservation toEntity(ReservationDTO reservationDTO);

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

    default User toUser(Long id) {
        if (id == null) {
            return null;
        }
        User user = new User();
        user.setId(id);
        return user;
    }
}
