package com.mycompany.reservation.domain;

import static com.mycompany.reservation.domain.BusinessTestSamples.*;
import static com.mycompany.reservation.domain.CustomerTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.reservation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CustomerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Customer.class);
        Customer customer1 = getCustomerSample1();
        Customer customer2 = new Customer();
        assertThat(customer1).isNotEqualTo(customer2);

        customer2.setId(customer1.getId());
        assertThat(customer1).isEqualTo(customer2);

        customer2 = getCustomerSample2();
        assertThat(customer1).isNotEqualTo(customer2);
    }

    @Test
    void businessTest() {
        Customer customer = getCustomerRandomSampleGenerator();
        Business businessBack = getBusinessRandomSampleGenerator();

        customer.setBusiness(businessBack);
        assertThat(customer.getBusiness()).isEqualTo(businessBack);

        customer.business(null);
        assertThat(customer.getBusiness()).isNull();
    }
}
