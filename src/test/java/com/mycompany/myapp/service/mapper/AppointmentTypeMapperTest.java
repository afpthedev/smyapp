package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.AppointmentTypeAsserts.*;
import static com.mycompany.myapp.domain.AppointmentTypeTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AppointmentTypeMapperTest {

    private AppointmentTypeMapper appointmentTypeMapper;

    @BeforeEach
    void setUp() {
        appointmentTypeMapper = new AppointmentTypeMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getAppointmentTypeSample1();
        var actual = appointmentTypeMapper.toEntity(appointmentTypeMapper.toDto(expected));
        assertAppointmentTypeAllPropertiesEquals(expected, actual);
    }
}
