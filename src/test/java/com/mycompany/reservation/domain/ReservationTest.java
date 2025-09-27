package com.mycompany.reservation.domain;

import static com.mycompany.reservation.domain.BusinessTestSamples.*;
import static com.mycompany.reservation.domain.CustomerTestSamples.*;
import static com.mycompany.reservation.domain.OfferedServiceTestSamples.*;
import static com.mycompany.reservation.domain.ReservationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.reservation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReservationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Reservation.class);
        Reservation reservation1 = getReservationSample1();
        Reservation reservation2 = new Reservation();
        assertThat(reservation1).isNotEqualTo(reservation2);

        reservation2.setId(reservation1.getId());
        assertThat(reservation1).isEqualTo(reservation2);

        reservation2 = getReservationSample2();
        assertThat(reservation1).isNotEqualTo(reservation2);
    }

    @Test
    void serviceTest() {
        Reservation reservation = getReservationRandomSampleGenerator();
        OfferedService offeredServiceBack = getOfferedServiceRandomSampleGenerator();

        reservation.setService(offeredServiceBack);
        assertThat(reservation.getService()).isEqualTo(offeredServiceBack);

        reservation.service(null);
        assertThat(reservation.getService()).isNull();
    }

    @Test
    void customerTest() {
        Reservation reservation = getReservationRandomSampleGenerator();
        Customer customerBack = getCustomerRandomSampleGenerator();

        reservation.setCustomer(customerBack);
        assertThat(reservation.getCustomer()).isEqualTo(customerBack);

        reservation.customer(null);
        assertThat(reservation.getCustomer()).isNull();
    }

    @Test
    void businessTest() {
        Reservation reservation = getReservationRandomSampleGenerator();
        Business businessBack = getBusinessRandomSampleGenerator();

        reservation.setBusiness(businessBack);
        assertThat(reservation.getBusiness()).isEqualTo(businessBack);

        reservation.business(null);
        assertThat(reservation.getBusiness()).isNull();
    }
}
