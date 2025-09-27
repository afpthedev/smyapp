package com.mycompany.reservation.service.mapper;

import static com.mycompany.reservation.domain.ServiceAsserts.*;
import static com.mycompany.reservation.domain.ServiceTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ServiceMapperTest {

    private ServiceMapper serviceMapper;

    @BeforeEach
    void setUp() {
        serviceMapper = new ServiceMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getServiceSample1();
        var actual = serviceMapper.toEntity(serviceMapper.toDto(expected));
        assertServiceAllPropertiesEquals(expected, actual);
    }
}
