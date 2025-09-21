package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Appointment;
import com.mycompany.myapp.domain.Notification;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.service.dto.AppointmentDTO;
import com.mycompany.myapp.service.dto.NotificationDTO;
import com.mycompany.myapp.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Notification} and its DTO {@link NotificationDTO}.
 */
@Mapper(componentModel = "spring")
public interface NotificationMapper extends EntityMapper<NotificationDTO, Notification> {
    @Mapping(target = "appointment", source = "appointment", qualifiedByName = "appointmentTitle")
    @Mapping(target = "recipient", source = "recipient", qualifiedByName = "userLogin")
    NotificationDTO toDto(Notification s);

    @Named("appointmentTitle")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    AppointmentDTO toDtoAppointmentTitle(Appointment appointment);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
