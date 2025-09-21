package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class AppointmentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Appointment getAppointmentSample1() {
        return new Appointment().id(1L).title("title1").duration(1);
    }

    public static Appointment getAppointmentSample2() {
        return new Appointment().id(2L).title("title2").duration(2);
    }

    public static Appointment getAppointmentRandomSampleGenerator() {
        return new Appointment().id(longCount.incrementAndGet()).title(UUID.randomUUID().toString()).duration(intCount.incrementAndGet());
    }
}
