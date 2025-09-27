package com.mycompany.reservation.domain;

import static com.mycompany.reservation.domain.BusinessTestSamples.*;
import static com.mycompany.reservation.domain.OfferedServiceTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.reservation.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OfferedServiceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OfferedService.class);
        OfferedService offeredService1 = getOfferedServiceSample1();
        OfferedService offeredService2 = new OfferedService();
        assertThat(offeredService1).isNotEqualTo(offeredService2);

        offeredService2.setId(offeredService1.getId());
        assertThat(offeredService1).isEqualTo(offeredService2);

        offeredService2 = getOfferedServiceSample2();
        assertThat(offeredService1).isNotEqualTo(offeredService2);
    }

    @Test
    void businessTest() {
        OfferedService offeredService = getOfferedServiceRandomSampleGenerator();
        Business businessBack = getBusinessRandomSampleGenerator();

        offeredService.setBusiness(businessBack);
        assertThat(offeredService.getBusiness()).isEqualTo(businessBack);

        offeredService.business(null);
        assertThat(offeredService.getBusiness()).isNull();
    }
}
