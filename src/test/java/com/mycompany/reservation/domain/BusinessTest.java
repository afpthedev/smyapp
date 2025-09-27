package com.mycompany.reservation.domain;

import static com.mycompany.reservation.domain.BusinessTestSamples.*;
import static com.mycompany.reservation.domain.CustomerTestSamples.*;
import static com.mycompany.reservation.domain.OfferedServiceTestSamples.*;
import static com.mycompany.reservation.domain.PaymentTestSamples.*;
import static com.mycompany.reservation.domain.ReservationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.reservation.web.rest.TestUtil;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.Test;

class BusinessTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Business.class);
        Business business1 = getBusinessSample1();
        Business business2 = new Business();
        assertThat(business1).isNotEqualTo(business2);

        business2.setId(business1.getId());
        assertThat(business1).isEqualTo(business2);

        business2 = getBusinessSample2();
        assertThat(business1).isNotEqualTo(business2);
    }

    @Test
    void servicesTest() {
        Business business = getBusinessRandomSampleGenerator();
        OfferedService offeredServiceBack = getOfferedServiceRandomSampleGenerator();

        business.addServices(offeredServiceBack);
        assertThat(business.getServices()).containsOnly(offeredServiceBack);
        assertThat(offeredServiceBack.getBusiness()).isEqualTo(business);

        business.removeServices(offeredServiceBack);
        assertThat(business.getServices()).doesNotContain(offeredServiceBack);
        assertThat(offeredServiceBack.getBusiness()).isNull();

        business.services(new HashSet<>(Set.of(offeredServiceBack)));
        assertThat(business.getServices()).containsOnly(offeredServiceBack);
        assertThat(offeredServiceBack.getBusiness()).isEqualTo(business);

        business.setServices(new HashSet<>());
        assertThat(business.getServices()).doesNotContain(offeredServiceBack);
        assertThat(offeredServiceBack.getBusiness()).isNull();
    }

    @Test
    void reservationsTest() {
        Business business = getBusinessRandomSampleGenerator();
        Reservation reservationBack = getReservationRandomSampleGenerator();

        business.addReservations(reservationBack);
        assertThat(business.getReservations()).containsOnly(reservationBack);
        assertThat(reservationBack.getBusiness()).isEqualTo(business);

        business.removeReservations(reservationBack);
        assertThat(business.getReservations()).doesNotContain(reservationBack);
        assertThat(reservationBack.getBusiness()).isNull();

        business.reservations(new HashSet<>(Set.of(reservationBack)));
        assertThat(business.getReservations()).containsOnly(reservationBack);
        assertThat(reservationBack.getBusiness()).isEqualTo(business);

        business.setReservations(new HashSet<>());
        assertThat(business.getReservations()).doesNotContain(reservationBack);
        assertThat(reservationBack.getBusiness()).isNull();
    }

    @Test
    void paymentsTest() {
        Business business = getBusinessRandomSampleGenerator();
        Payment paymentBack = getPaymentRandomSampleGenerator();

        business.addPayments(paymentBack);
        assertThat(business.getPayments()).containsOnly(paymentBack);
        assertThat(paymentBack.getBusiness()).isEqualTo(business);

        business.removePayments(paymentBack);
        assertThat(business.getPayments()).doesNotContain(paymentBack);
        assertThat(paymentBack.getBusiness()).isNull();

        business.payments(new HashSet<>(Set.of(paymentBack)));
        assertThat(business.getPayments()).containsOnly(paymentBack);
        assertThat(paymentBack.getBusiness()).isEqualTo(business);

        business.setPayments(new HashSet<>());
        assertThat(business.getPayments()).doesNotContain(paymentBack);
        assertThat(paymentBack.getBusiness()).isNull();
    }

    @Test
    void customersTest() {
        Business business = getBusinessRandomSampleGenerator();
        Customer customerBack = getCustomerRandomSampleGenerator();

        business.addCustomers(customerBack);
        assertThat(business.getCustomers()).containsOnly(customerBack);
        assertThat(customerBack.getBusiness()).isEqualTo(business);

        business.removeCustomers(customerBack);
        assertThat(business.getCustomers()).doesNotContain(customerBack);
        assertThat(customerBack.getBusiness()).isNull();

        business.customers(new HashSet<>(Set.of(customerBack)));
        assertThat(business.getCustomers()).containsOnly(customerBack);
        assertThat(customerBack.getBusiness()).isEqualTo(business);

        business.setCustomers(new HashSet<>());
        assertThat(business.getCustomers()).doesNotContain(customerBack);
        assertThat(customerBack.getBusiness()).isNull();
    }
}
