package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.AppointmentType;
import com.mycompany.myapp.service.dto.AppointmentTypeDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link AppointmentType} and its DTO {@link AppointmentTypeDTO}.
 */
@Mapper(componentModel = "spring")
public interface AppointmentTypeMapper extends EntityMapper<AppointmentTypeDTO, AppointmentType> {}
