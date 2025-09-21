package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Appointment;
import com.mycompany.myapp.domain.AppointmentType;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.service.dto.AppointmentDTO;
import com.mycompany.myapp.service.dto.AppointmentTypeDTO;
import com.mycompany.myapp.service.dto.UserDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Appointment} and its DTO {@link AppointmentDTO}.
 */
@Mapper(componentModel = "spring")
public interface AppointmentMapper extends EntityMapper<AppointmentDTO, Appointment> {
    @Mapping(target = "createdBy", source = "createdBy", qualifiedByName = "userLogin")
    @Mapping(target = "type", source = "type", qualifiedByName = "appointmentTypeName")
    @Mapping(target = "participants", source = "participants", qualifiedByName = "userLoginSet")
    AppointmentDTO toDto(Appointment s);

    @Mapping(target = "removeParticipants", ignore = true)
    Appointment toEntity(AppointmentDTO appointmentDTO);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);

    @Named("userLoginSet")
    default Set<UserDTO> toDtoUserLoginSet(Set<User> user) {
        return user.stream().map(this::toDtoUserLogin).collect(Collectors.toSet());
    }

    @Named("appointmentTypeName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    AppointmentTypeDTO toDtoAppointmentTypeName(AppointmentType appointmentType);
}
