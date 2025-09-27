package com.mycompany.reservation.service.mapper;

import static com.mycompany.reservation.domain.OfferedServiceAsserts.*;
import static com.mycompany.reservation.domain.OfferedServiceTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class OfferedServiceMapperTest {

    private OfferedServiceMapper offeredServiceMapper;

    @BeforeEach
    void setUp() {
        offeredServiceMapper = new OfferedServiceMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getOfferedServiceSample1();
        var actual = offeredServiceMapper.toEntity(offeredServiceMapper.toDto(expected));
        assertOfferedServiceAllPropertiesEquals(expected, actual);
    }
}
