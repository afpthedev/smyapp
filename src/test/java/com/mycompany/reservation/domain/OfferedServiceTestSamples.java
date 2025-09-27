package com.mycompany.reservation.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class OfferedServiceTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static OfferedService getOfferedServiceSample1() {
        return new OfferedService().id(1L).name("name1").description("description1").duration(1);
    }

    public static OfferedService getOfferedServiceSample2() {
        return new OfferedService().id(2L).name("name2").description("description2").duration(2);
    }

    public static OfferedService getOfferedServiceRandomSampleGenerator() {
        return new OfferedService()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .duration(intCount.incrementAndGet());
    }
}
