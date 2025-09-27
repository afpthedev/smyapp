package com.mycompany.reservation.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ServiceTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Service getServiceSample1() {
        return new Service().id(1L).name("name1").description("description1").duration(1);
    }

    public static Service getServiceSample2() {
        return new Service().id(2L).name("name2").description("description2").duration(2);
    }

    public static Service getServiceRandomSampleGenerator() {
        return new Service()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .duration(intCount.incrementAndGet());
    }
}
