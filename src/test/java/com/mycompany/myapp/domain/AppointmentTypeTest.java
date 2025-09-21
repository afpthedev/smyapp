package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AppointmentTypeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AppointmentTypeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AppointmentType.class);
        AppointmentType appointmentType1 = getAppointmentTypeSample1();
        AppointmentType appointmentType2 = new AppointmentType();
        assertThat(appointmentType1).isNotEqualTo(appointmentType2);

        appointmentType2.setId(appointmentType1.getId());
        assertThat(appointmentType1).isEqualTo(appointmentType2);

        appointmentType2 = getAppointmentTypeSample2();
        assertThat(appointmentType1).isNotEqualTo(appointmentType2);
    }
}
