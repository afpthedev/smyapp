package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AppointmentTypeTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static AppointmentType getAppointmentTypeSample1() {
        return new AppointmentType().id(1L).name("name1").description("description1").color("color1");
    }

    public static AppointmentType getAppointmentTypeSample2() {
        return new AppointmentType().id(2L).name("name2").description("description2").color("color2");
    }

    public static AppointmentType getAppointmentTypeRandomSampleGenerator() {
        return new AppointmentType()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .color(UUID.randomUUID().toString());
    }
}
