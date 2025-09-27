package com.mycompany.reservation.domain;

import static com.mycompany.reservation.domain.BusinessTestSamples.*;
import static com.mycompany.reservation.domain.CustomerTestSamples.*;
import static com.mycompany.reservation.domain.PaymentTestSamples.*;
import static com.mycompany.reservation.domain.ReservationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.reservation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PaymentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Payment.class);
        Payment payment1 = getPaymentSample1();
        Payment payment2 = new Payment();
        assertThat(payment1).isNotEqualTo(payment2);

        payment2.setId(payment1.getId());
        assertThat(payment1).isEqualTo(payment2);

        payment2 = getPaymentSample2();
        assertThat(payment1).isNotEqualTo(payment2);
    }

    @Test
    void reservationTest() {
        Payment payment = getPaymentRandomSampleGenerator();
        Reservation reservationBack = getReservationRandomSampleGenerator();

        payment.setReservation(reservationBack);
        assertThat(payment.getReservation()).isEqualTo(reservationBack);

        payment.reservation(null);
        assertThat(payment.getReservation()).isNull();
    }

    @Test
    void customerTest() {
        Payment payment = getPaymentRandomSampleGenerator();
        Customer customerBack = getCustomerRandomSampleGenerator();

        payment.setCustomer(customerBack);
        assertThat(payment.getCustomer()).isEqualTo(customerBack);

        payment.customer(null);
        assertThat(payment.getCustomer()).isNull();
    }

    @Test
    void businessTest() {
        Payment payment = getPaymentRandomSampleGenerator();
        Business businessBack = getBusinessRandomSampleGenerator();

        payment.setBusiness(businessBack);
        assertThat(payment.getBusiness()).isEqualTo(businessBack);

        payment.business(null);
        assertThat(payment.getBusiness()).isNull();
    }
}
