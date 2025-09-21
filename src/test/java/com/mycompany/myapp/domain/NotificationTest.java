package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AppointmentTestSamples.*;
import static com.mycompany.myapp.domain.NotificationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class NotificationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Notification.class);
        Notification notification1 = getNotificationSample1();
        Notification notification2 = new Notification();
        assertThat(notification1).isNotEqualTo(notification2);

        notification2.setId(notification1.getId());
        assertThat(notification1).isEqualTo(notification2);

        notification2 = getNotificationSample2();
        assertThat(notification1).isNotEqualTo(notification2);
    }

    @Test
    void appointmentTest() {
        Notification notification = getNotificationRandomSampleGenerator();
        Appointment appointmentBack = getAppointmentRandomSampleGenerator();

        notification.setAppointment(appointmentBack);
        assertThat(notification.getAppointment()).isEqualTo(appointmentBack);

        notification.appointment(null);
        assertThat(notification.getAppointment()).isNull();
    }
}
